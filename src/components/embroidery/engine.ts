import { FOOTER_FABRIC } from "./patches";
import { makeEmbroideryScene, type EmbroideryScene } from "./scene";
import {
  EMBROIDERY_FRAGMENT_SHADER,
  EMBROIDERY_VERTEX_SHADER,
} from "./shaders";

const WEAVE_URL = `${import.meta.env.BASE_URL}assets/textures/embroidery-weave.svg`;
const REST_ANGLE = (73 * Math.PI) / 180;
const LIGHT_Z = 0.58;
const WEAVE_SCALE = 16;

type IdleWindow = Window & {
  requestIdleCallback?: (
    callback: () => void,
    options?: { timeout: number },
  ) => number;
  cancelIdleCallback?: (id: number) => void;
};

export class EmbroideryRenderer {
  private readonly host: HTMLElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly fontFamily: string;
  private readonly reducedMotion: boolean;
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private uniforms: Record<string, WebGLUniformLocation | null> = {};
  private quad: WebGLBuffer | null = null;
  private artTexture: WebGLTexture | null = null;
  private fieldTexture: WebGLTexture | null = null;
  private weaveTexture: WebGLTexture | null = null;
  private fallbackCanvas: HTMLCanvasElement | null = null;
  private lastScene: EmbroideryScene | null = null;
  private textureWidth = 1;
  private textureHeight = 1;
  private width = 0;
  private height = 0;
  private pixelRatio = 1;
  private builtWidth = 0;
  private builtHeight = 0;
  private buildScheduled = 0;
  private buildVersion = 0;
  private animationFrame = 0;
  private running = false;
  private awake = false;
  private ready = false;
  private destroyed = false;
  private hover = 0;
  private hoverTarget = 0;
  private pointerX = 0.52;
  private pointerY = 0.48;
  private pointerTargetX = 0.52;
  private pointerTargetY = 0.48;

  constructor(
    host: HTMLElement,
    fontFamily: string,
    reducedMotion: boolean,
  ) {
    this.host = host;
    this.fontFamily = fontFamily;
    this.reducedMotion = reducedMotion;
    this.canvas = document.createElement("canvas");
    this.canvas.className = "embroidered-footer__canvas";
    this.canvas.setAttribute("aria-hidden", "true");
    this.host.appendChild(this.canvas);

    this.gl = this.canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: "low-power",
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      stencil: false,
    });

    this.host.addEventListener("pointerenter", this.onPointerEnter);
    this.host.addEventListener("pointerleave", this.onPointerLeave);
    this.host.addEventListener("pointermove", this.onPointerMove, {
      passive: true,
    });
    this.canvas.addEventListener("webglcontextlost", this.onContextLost);
    this.resize();

    if (!this.gl || !this.initializeWebGl()) {
      this.gl = null;
      this.host.dataset.renderMode = "fallback";
    }
  }

  start() {
    if (this.destroyed) return;
    this.awake = true;
    this.scheduleBuild();
    if (this.ready && !this.reducedMotion) this.startLoop();
    else if (this.ready) this.render();
  }

  stop() {
    this.awake = false;
    this.pause();
  }

  resize() {
    const rect = this.host.getBoundingClientRect();
    this.pixelRatio = Math.min(1.75, window.devicePixelRatio || 1);
    this.width = Math.max(1, rect.width);
    this.height = Math.max(1, rect.height);
    const canvasWidth = Math.max(1, Math.round(this.width * this.pixelRatio));
    const canvasHeight = Math.max(1, Math.round(this.height * this.pixelRatio));

    if (
      this.canvas.width !== canvasWidth ||
      this.canvas.height !== canvasHeight
    ) {
      this.canvas.width = canvasWidth;
      this.canvas.height = canvasHeight;
      this.gl?.viewport(0, 0, canvasWidth, canvasHeight);
      if (this.awake) this.scheduleBuild();
    }

    if (this.fallbackCanvas && this.lastScene) {
      this.drawFallback(this.lastScene);
    }
  }

  destroy() {
    this.destroyed = true;
    this.cancelBuild();
    this.stop();
    this.host.removeEventListener("pointerenter", this.onPointerEnter);
    this.host.removeEventListener("pointerleave", this.onPointerLeave);
    this.host.removeEventListener("pointermove", this.onPointerMove);
    this.canvas.removeEventListener("webglcontextlost", this.onContextLost);

    const gl = this.gl;
    if (gl) {
      if (this.artTexture) gl.deleteTexture(this.artTexture);
      if (this.fieldTexture) gl.deleteTexture(this.fieldTexture);
      if (this.weaveTexture) gl.deleteTexture(this.weaveTexture);
      if (this.quad) gl.deleteBuffer(this.quad);
      if (this.program) gl.deleteProgram(this.program);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }

    this.canvas.remove();
    this.fallbackCanvas?.remove();
  }

  private initializeWebGl() {
    const gl = this.gl;
    if (!gl) return false;

    try {
      this.program = this.buildProgram(
        EMBROIDERY_VERTEX_SHADER,
        EMBROIDERY_FRAGMENT_SHADER,
      );
    } catch {
      this.host.dataset.shaderFailed = "true";
      return false;
    }

    for (const name of [
      "uArt",
      "uField",
      "uWeave",
      "uTexel",
      "uLight",
      "uPointer",
      "uLightZ",
      "uHover",
      "uAspect",
      "uDepth",
      "uWeaveScale",
      "uFabric",
    ]) {
      this.uniforms[name] = gl.getUniformLocation(this.program, name);
    }

    const positionLocation = gl.getAttribLocation(this.program, "aPosition");
    const uvLocation = gl.getAttribLocation(this.program, "aUv");
    this.quad = gl.createBuffer();
    if (!this.quad || positionLocation < 0 || uvLocation < 0) return false;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1, 0, 1,
        1, -1, 1, 1,
        -1, 1, 0, 0,
        1, 1, 1, 0,
      ]),
      gl.STATIC_DRAW,
    );
    gl.useProgram(this.program);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(uvLocation);
    gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 16, 8);

    this.weaveTexture = this.createPlaceholderTexture();
    this.loadWeaveTexture();
    return true;
  }

  private buildProgram(vertexSource: string, fragmentSource: string) {
    const gl = this.gl!;
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) throw new Error("Unable to create shader");
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const message = gl.getShaderInfoLog(shader) || "Shader compilation failed";
        gl.deleteShader(shader);
        throw new Error(message);
      }
      return shader;
    };

    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    if (!program) throw new Error("Unable to create WebGL program");
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const message = gl.getProgramInfoLog(program) || "Program linking failed";
      gl.deleteProgram(program);
      throw new Error(message);
    }
    return program;
  }

  private createPlaceholderTexture() {
    const gl = this.gl!;
    const texture = gl.createTexture();
    if (!texture) return null;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([145, 145, 145, 255]),
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    return texture;
  }

  private loadWeaveTexture() {
    const image = new Image();
    image.onload = () => {
      const gl = this.gl;
      if (!gl || !this.weaveTexture || this.destroyed) return;
      gl.bindTexture(gl.TEXTURE_2D, this.weaveTexture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image,
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      if (this.ready) this.render();
    };
    image.onerror = () => {
      this.host.dataset.weaveFailed = "true";
    };
    image.src = WEAVE_URL;
  }

  private maskSize(): [number, number] {
    const maxWidth = 1400;
    const maxHeight = 1200;
    let maskWidth = Math.max(
      2,
      Math.min(maxWidth, Math.round(this.width * this.pixelRatio)),
    );
    let maskHeight = Math.max(
      2,
      Math.round(maskWidth * (this.height / Math.max(1, this.width))),
    );

    if (maskHeight > maxHeight) {
      const scale = maxHeight / maskHeight;
      maskHeight = maxHeight;
      maskWidth = Math.max(2, Math.round(maskWidth * scale));
    }

    return [maskWidth, maskHeight];
  }

  private scheduleBuild() {
    if (this.destroyed || this.buildScheduled) return;
    const [maskWidth, maskHeight] = this.maskSize();
    if (
      maskWidth === this.builtWidth &&
      maskHeight === this.builtHeight &&
      this.lastScene
    ) {
      if (this.gl) this.render();
      else this.drawFallback(this.lastScene);
      return;
    }

    const run = () => {
      this.buildScheduled = 0;
      void this.buildScene();
    };
    const idleWindow = window as IdleWindow;
    this.buildScheduled = idleWindow.requestIdleCallback
      ? idleWindow.requestIdleCallback(run, { timeout: 350 })
      : window.setTimeout(run, 0);
  }

  private cancelBuild() {
    if (!this.buildScheduled) return;
    const idleWindow = window as IdleWindow;
    if (idleWindow.cancelIdleCallback) {
      idleWindow.cancelIdleCallback(this.buildScheduled);
    } else {
      window.clearTimeout(this.buildScheduled);
    }
    this.buildScheduled = 0;
  }

  private async buildScene() {
    if (this.destroyed) return;
    const version = ++this.buildVersion;
    const [maskWidth, maskHeight] = this.maskSize();

    try {
      const scene = await makeEmbroideryScene(
        maskWidth,
        maskHeight,
        this.fontFamily,
      );
      if (this.destroyed || version !== this.buildVersion) return;
      this.lastScene = scene;
      this.builtWidth = maskWidth;
      this.builtHeight = maskHeight;

      if (!this.gl || !this.program) {
        this.drawFallback(scene);
        return;
      }

      if (!this.artTexture) this.artTexture = this.gl.createTexture();
      if (!this.fieldTexture) this.fieldTexture = this.gl.createTexture();
      if (!this.artTexture || !this.fieldTexture) {
        this.drawFallback(scene);
        return;
      }

      this.uploadCanvas(this.artTexture, scene.art);
      this.uploadPixels(this.fieldTexture, scene.field);
      this.textureWidth = scene.field.width;
      this.textureHeight = scene.field.height;
      this.ready = true;
      this.host.dataset.renderMode = "webgl";
      this.render();
      this.canvas.dataset.ready = "true";
      if (this.awake && !this.reducedMotion) this.startLoop();
    } catch {
      this.host.dataset.renderMode = "fallback";
      if (this.lastScene) this.drawFallback(this.lastScene);
    }
  }

  private uploadCanvas(texture: WebGLTexture, canvas: HTMLCanvasElement) {
    const gl = this.gl!;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      canvas,
    );
  }

  private uploadPixels(
    texture: WebGLTexture,
    pixels: { data: Uint8Array; width: number; height: number },
  ) {
    const gl = this.gl!;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      pixels.width,
      pixels.height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      pixels.data,
    );
  }

  private drawFallback(scene: EmbroideryScene) {
    if (!this.fallbackCanvas) {
      this.fallbackCanvas = document.createElement("canvas");
      this.fallbackCanvas.className =
        "embroidered-footer__canvas embroidered-footer__canvas--fallback";
      this.fallbackCanvas.setAttribute("aria-hidden", "true");
      this.host.appendChild(this.fallbackCanvas);
    }

    const width = Math.max(1, Math.round(this.width * this.pixelRatio));
    const height = Math.max(1, Math.round(this.height * this.pixelRatio));
    this.fallbackCanvas.width = width;
    this.fallbackCanvas.height = height;
    const context = this.fallbackCanvas.getContext("2d");
    if (!context) return;
    context.imageSmoothingEnabled = true;
    context.drawImage(scene.art, 0, 0, width, height);
    this.fallbackCanvas.dataset.ready = "true";
    this.canvas.style.opacity = "0";
    this.host.dataset.renderMode = "fallback";
  }

  private startLoop() {
    if (this.running || !this.ready || this.reducedMotion || !this.awake) return;
    this.running = true;
    const frame = () => {
      if (!this.running) return;
      this.pointerX += (this.pointerTargetX - this.pointerX) * 0.12;
      this.pointerY += (this.pointerTargetY - this.pointerY) * 0.12;
      this.hover += (this.hoverTarget - this.hover) * 0.12;
      this.render();

      const settled =
        Math.abs(this.hover - this.hoverTarget) < 0.002 &&
        Math.abs(this.pointerX - this.pointerTargetX) < 0.001 &&
        Math.abs(this.pointerY - this.pointerTargetY) < 0.001;
      if (settled && this.hoverTarget < 0.002) {
        this.pause();
        return;
      }
      this.animationFrame = window.requestAnimationFrame(frame);
    };
    this.animationFrame = window.requestAnimationFrame(frame);
  }

  private pause() {
    this.running = false;
    if (this.animationFrame) {
      window.cancelAnimationFrame(this.animationFrame);
      this.animationFrame = 0;
    }
  }

  private render() {
    const gl = this.gl;
    if (
      !gl ||
      !this.program ||
      !this.artTexture ||
      !this.fieldTexture ||
      !this.weaveTexture
    ) {
      return;
    }

    const angle =
      REST_ANGLE + (this.pointerX - 0.5) * 1.35 * this.hover;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.useProgram(this.program);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.artTexture);
    gl.uniform1i(this.uniforms.uArt, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.fieldTexture);
    gl.uniform1i(this.uniforms.uField, 1);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, this.weaveTexture);
    gl.uniform1i(this.uniforms.uWeave, 2);
    gl.uniform2f(
      this.uniforms.uTexel,
      1 / this.textureWidth,
      1 / this.textureHeight,
    );
    gl.uniform2f(this.uniforms.uLight, Math.cos(angle), Math.sin(angle));
    gl.uniform2f(this.uniforms.uPointer, this.pointerX, this.pointerY);
    gl.uniform1f(this.uniforms.uLightZ, LIGHT_Z);
    gl.uniform1f(this.uniforms.uHover, this.hover);
    gl.uniform1f(this.uniforms.uAspect, this.width / Math.max(1, this.height));
    gl.uniform1f(this.uniforms.uDepth, 1.15);
    gl.uniform1f(this.uniforms.uWeaveScale, WEAVE_SCALE);
    gl.uniform3f(
      this.uniforms.uFabric,
      FOOTER_FABRIC[0],
      FOOTER_FABRIC[1],
      FOOTER_FABRIC[2],
    );
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  private onPointerEnter = (event: PointerEvent) => {
    if (
      this.reducedMotion ||
      (event.pointerType !== "mouse" && event.pointerType !== "pen")
    ) {
      return;
    }
    this.hoverTarget = 1;
    this.startLoop();
  };

  private onPointerLeave = (event: PointerEvent) => {
    if (
      this.reducedMotion ||
      (event.pointerType !== "mouse" && event.pointerType !== "pen")
    ) {
      return;
    }
    this.hoverTarget = 0;
    this.startLoop();
  };

  private onPointerMove = (event: PointerEvent) => {
    if (
      this.reducedMotion ||
      (event.pointerType !== "mouse" && event.pointerType !== "pen")
    ) {
      return;
    }
    const rect = this.host.getBoundingClientRect();
    this.pointerTargetX = (event.clientX - rect.left) / Math.max(1, rect.width);
    this.pointerTargetY =
      1 - (event.clientY - rect.top) / Math.max(1, rect.height);
    this.startLoop();
  };

  private onContextLost = (event: Event) => {
    event.preventDefault();
    this.pause();
    this.gl = null;
    this.host.dataset.contextLost = "true";
    if (this.lastScene) this.drawFallback(this.lastScene);
  };
}
