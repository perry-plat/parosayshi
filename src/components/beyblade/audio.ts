type SpinVoice = {
  carrier: OscillatorNode;
  overtone: OscillatorNode;
  gain: GainNode;
  panner: StereoPannerNode | null;
};

type AudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

export class BeybladeAudio {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private enabled = true;
  private voices = new Map<string, SpinVoice>();

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) this.stopSpin();
    if (this.context && this.master) {
      this.master.gain.setTargetAtTime(
        enabled ? 0.58 : 0,
        this.context.currentTime,
        0.015,
      );
    }
  }

  async unlock() {
    if (!this.context) {
      const AudioContextConstructor =
        window.AudioContext ?? (window as AudioWindow).webkitAudioContext;
      if (!AudioContextConstructor) return false;

      this.context = new AudioContextConstructor();
      this.master = this.context.createGain();
      this.master.gain.value = this.enabled ? 0.58 : 0;
      this.master.connect(this.context.destination);
    }

    if (this.context.state === "suspended") {
      await this.context.resume().catch(() => undefined);
    }

    return this.context.state === "running";
  }

  pullTick(tension: number) {
    if (!this.enabled) return;
    const context = this.context;
    if (!context) return;

    const now = context.currentTime;
    this.tone(
      now,
      520 + tension * 380,
      360 + tension * 240,
      0.035,
      "square",
      0.035,
    );
  }

  launch(power: number) {
    if (!this.enabled) return;
    const context = this.context;
    if (!context) return;

    const now = context.currentTime;
    this.noise(now, 0.22, 1250 + power * 1800, 0.14, "bandpass");
    this.tone(now, 190 + power * 90, 58, 0.24, "sawtooth", 0.09);
    this.tone(now + 0.025, 880, 430, 0.07, "square", 0.035);
  }

  startTop(id: string, initialPan: number) {
    if (
      !this.enabled ||
      !this.context ||
      !this.master ||
      this.voices.has(id)
    ) {
      return;
    }

    this.voices.set(id, this.makeSpinVoice(initialPan));
  }

  updateSpin(id: string, rpm: number, x: number, speed: number) {
    if (!this.enabled || !this.context) return;
    const voice = this.voices.get(id);
    if (!voice) return;

    const now = this.context.currentTime;
    const normalizedRpm = Math.max(0, Math.min(1, rpm / 1450));
    const frequency = 54 + normalizedRpm * 116 + Math.min(42, speed * 0.07);
    const voiceCount = Math.max(1, this.voices.size);
    const crowdMix = 1 / Math.sqrt(voiceCount);
    const gain =
      normalizedRpm > 0.03
        ? (0.006 + normalizedRpm * 0.014) * crowdMix
        : 0;

    voice.carrier.frequency.setTargetAtTime(frequency, now, 0.025);
    voice.overtone.frequency.setTargetAtTime(frequency * 2.03, now, 0.025);
    voice.gain.gain.setTargetAtTime(gain, now, 0.035);
    voice.panner?.pan.setTargetAtTime(
      Math.max(-0.82, Math.min(0.82, (x - 500) / 520)),
      now,
      0.04,
    );
  }

  stopTop(id: string) {
    if (!this.context) return;
    const voice = this.voices.get(id);
    if (!voice) return;

    const now = this.context.currentTime;
    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setTargetAtTime(0, now, 0.025);
    voice.carrier.stop(now + 0.16);
    voice.overtone.stop(now + 0.16);
    this.voices.delete(id);
  }

  hit(intensity: number, x: number) {
    if (!this.enabled || !this.context || !this.master) return;

    const now = this.context.currentTime;
    const strength = Math.max(0.3, Math.min(1, intensity / 760));
    const panner = this.context.createStereoPanner();
    const hitGain = this.context.createGain();
    panner.pan.value = Math.max(-0.82, Math.min(0.82, (x - 500) / 520));
    hitGain.gain.value = 1;
    hitGain.connect(panner);
    panner.connect(this.master);

    this.tone(now, 210, 155, 0.1, "triangle", 0.11 * strength, hitGain);
    this.tone(now, 510, 390, 0.065, "square", 0.055 * strength, hitGain);
    this.tone(now, 1180, 740, 0.045, "sine", 0.04 * strength, hitGain);
    this.noise(now, 0.07, 2600, 0.09 * strength, "highpass", hitGain);

    window.setTimeout(() => {
      hitGain.disconnect();
      panner.disconnect();
    }, 180);
  }

  rail(direction: number) {
    if (!this.enabled || !this.context) return;

    const now = this.context.currentTime;
    this.noise(now, 0.2, 3200, 0.055, "highpass");
    this.tone(
      now,
      direction > 0 ? 160 : 220,
      direction > 0 ? 760 : 920,
      0.2,
      "sawtooth",
      0.055,
    );
  }

  finish(type: "spin" | "over" | "burst" | "extreme") {
    if (!this.enabled || !this.context) return;
    const now = this.context.currentTime;

    if (type === "burst") {
      [0, 0.045, 0.095].forEach((offset, index) => {
        this.tone(
          now + offset,
          740 - index * 120,
          250 - index * 25,
          0.11,
          index % 2 ? "triangle" : "square",
          0.075 - index * 0.012,
        );
        this.noise(now + offset, 0.055, 1800 + index * 500, 0.055, "bandpass");
      });
    } else if (type === "extreme") {
      this.tone(now, 180, 960, 0.28, "sawtooth", 0.075);
      this.noise(now + 0.07, 0.22, 3800, 0.08, "highpass");
    } else if (type === "over") {
      this.tone(now, 380, 120, 0.24, "triangle", 0.075);
      this.noise(now, 0.12, 1100, 0.07, "bandpass");
    } else {
      this.tone(now, 320, 210, 0.2, "sine", 0.06);
    }

    this.tone(now + 0.24, 520, 660, 0.18, "sine", 0.035);
  }

  stopSpin() {
    if (!this.context) return;
    const now = this.context.currentTime;

    this.voices.forEach((voice) => {
      voice.gain.gain.cancelScheduledValues(now);
      voice.gain.gain.setTargetAtTime(0, now, 0.025);
      voice.carrier.stop(now + 0.16);
      voice.overtone.stop(now + 0.16);
    });
    this.voices.clear();
  }

  destroy() {
    this.stopSpin();
    void this.context?.close();
    this.context = null;
    this.master = null;
  }

  private makeSpinVoice(initialPan: number): SpinVoice {
    const context = this.context!;
    const carrier = context.createOscillator();
    const overtone = context.createOscillator();
    const carrierGain = context.createGain();
    const overtoneGain = context.createGain();
    const voiceGain = context.createGain();
    const filter = context.createBiquadFilter();
    const panner =
      "createStereoPanner" in context ? context.createStereoPanner() : null;

    carrier.type = "triangle";
    overtone.type = "sine";
    carrier.frequency.value = 90;
    overtone.frequency.value = 182;
    carrierGain.gain.value = 0.72;
    overtoneGain.gain.value = 0.28;
    voiceGain.gain.value = 0;
    filter.type = "lowpass";
    filter.frequency.value = 1250;
    filter.Q.value = 0.7;

    carrier.connect(carrierGain);
    overtone.connect(overtoneGain);
    carrierGain.connect(filter);
    overtoneGain.connect(filter);
    filter.connect(voiceGain);

    if (panner) {
      panner.pan.value = initialPan;
      voiceGain.connect(panner);
      panner.connect(this.master!);
    } else {
      voiceGain.connect(this.master!);
    }

    carrier.start();
    overtone.start();
    return { carrier, overtone, gain: voiceGain, panner };
  }

  private tone(
    start: number,
    from: number,
    to: number,
    duration: number,
    type: OscillatorType,
    volume: number,
    destination: AudioNode | null = null,
  ) {
    const context = this.context;
    const output = destination ?? this.master;
    if (!context || !output) return;

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(Math.max(1, from), start);
    oscillator.frequency.exponentialRampToValueAtTime(
      Math.max(1, to),
      start + duration,
    );
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), start + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(output);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }

  private noise(
    start: number,
    duration: number,
    frequency: number,
    volume: number,
    filterType: BiquadFilterType,
    destination: AudioNode | null = null,
  ) {
    const context = this.context;
    const output = destination ?? this.master;
    if (!context || !output) return;

    const sampleCount = Math.ceil(context.sampleRate * duration);
    const buffer = context.createBuffer(1, sampleCount, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < data.length; index += 1) {
      data[index] = Math.random() * 2 - 1;
    }

    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = buffer;
    filter.type = filterType;
    filter.frequency.value = frequency;
    filter.Q.value = filterType === "bandpass" ? 1.7 : 0.7;
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(output);
    source.start(start);
  }
}
