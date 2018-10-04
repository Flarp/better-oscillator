const saw = v => v - Math.floor(v);

class BetterOscillatorProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.phase = 0;
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
  process(input, outputs, params) {
    for (let z = 0; z < outputs.length; z++) {
      const out = outputs[z][0];
      const outlen = out.length;
      const freq = params.frequency.length === 1;
      const phase = params.phase.length === 1;
      const wave = params.wave.length === 1;
      const duty = params.duty.length === 1;
      for (let x = 0; x < outlen; x++) {
        const main = (params.frequency[freq ? 0 : x] * x) / sampleRate;
        // sine wave made using bulit-in Math.sin
        if (params.wave[wave ? 0 : x] === 0) {
          out[x] = Math.sin(
            (main + this.phase + params.phase[phase ? 0 : x]) * 2 * Math.PI
          );
          // sawtooth wave using linear piecewise floor
        } else if (params.wave[wave ? 0 : x] === 1) {
          out[x] = saw(main + this.phase + params.phase[phase ? 0 : x]);
          // pulse wave using difference of phase shifted saws
        } else if (params.wave[wave ? 0 : x] === 2) {
          const temp = main + this.phase + params.phase[phase ? 0 : x];
          out[x] = saw(temp) - saw(temp + params.duty[duty ? 0 : x]);
          // triangle wave using absolute value of amplitude shifted sawtooth wave
        } else if (params.wave[wave ? 0 : x] === 3) {
          out[x] =
            2 *
            Math.abs(
              saw(main + this.phase + params.phase[phase ? 0 : x]) - 1 / 2
            );
        }
      }
      this.phase +=
        (params.frequency[freq ? 0 : outlen - 1] * outlen) / sampleRate;
      //this.phase %= sampleRate;
      return true;
    }
  }
}

registerProcessor("better-oscillator", BetterOscillatorProcessor);
