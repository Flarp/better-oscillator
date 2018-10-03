class BetterOscillatorProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.phase = 0;
    this.type = "sine";
  }
  set type(type) {
    this._type = type;
  }
  get type() {
    return this._type;
  }
  static get parameterDescriptors() {
    return [
      {
        name: "phase",
        defaultValue: sampleRate,
        max: Math.PI * 2,
        min: 0
      },
      {
        name: "duty",
        defaultValue: 0.5,
        min: 0,
        max: 1
      },
      {
        name: "frequency",
        defaultValue: 440,
        min: Number.EPSILON
      },
      {
        name: "sync",
        defaultValue: 0
      },
      {
        name: "wave",
        defaultValue: 0,
        min: 0,
        max: 2
      }
    ];
  }
  process(input, output, params) {
    const outlen = output[0][0].length;
    const freq = params.frequency.length === 1;
    const phase = params.phase.length === 1;
    const wave = params.wave.length === 1;
    const duty = params.duty.length === 1;
    for (let x = 0; x < outlen; x++) {
      const main = (params.frequency[freq ? 0 : x] * x) / sampleRate;
      if (params.wave[wave ? 0 : x] === 0) {
        output[0][0][x] = Math.sin(
          (main + this.phase + params.phase[phase ? 0 : x]) * 2 * Math.PI
        );
      } else if (params.wave[wave ? 0 : x] === 1) {
        output[0][0][x] =
          main +
          this.phase +
          params.phase[phase ? 0 : x] -
          Math.floor(main + this.phase + params.phase[phase ? 0 : x]);
      } else {
        const temp =
          main +
          this.phase +
          params.phase[phase ? 0 : x] -
          Math.floor(main + this.phase + params.phase[phase ? 0 : x]);
        const temp2 =
          main +
          this.phase +
          params.phase[phase ? 0 : x] +
          params.duty[duty ? 0 : x] -
          Math.floor(
            main +
              this.phase +
              params.phase[phase ? 0 : x] +
              params.duty[duty ? 0 : x]
          );
        output[0][0][x] = temp - temp2;
      }
    }
    this.phase +=
      (params.frequency[freq ? 0 : outlen - 1] * outlen) / sampleRate;
    return true;
  }
}

registerProcessor("better-oscillator", BetterOscillatorProcessor);
