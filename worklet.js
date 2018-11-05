const saw = v => v - Math.floor(v);

class BetterOscillatorProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.phase = 0;
    this.sync_phase = 0;
    this.prev_sync_phase = 0
  }
  static get parameterDescriptors() {
    return [
      {
        name: "phase",
        defaultValue: 0,
        max: 1,
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
        name: "wave",
        defaultValue: 3,
        min: 0,
        max: 3
      },
      {
        name: "sync",
        defaultValue: 0,
        min: 0,
      }
    ];
  }
  process(input, outputs, params) {
    for (let z = 0; z < outputs.length; z++) {
      if (outputs.length > 1) {
        //throw "the match";
      }
      const out = outputs[z][0];
      const outlen = out.length;
      const freq = params.frequency.length === 1;
      const phase = params.phase.length === 1;
      const wave = params.wave.length === 1;
      const duty = params.duty.length === 1;
      const sync = params.sync.length === 1
      const inp = input[0][0].length === 0;
      let back = 0
      for (let x = 0; x < outlen; x++) {
        this.sync_phase = (this.prev_sync_phase) % (params.sync[sync ? 0 : x]/sampleRate)
        if (params.sync[sync ? 0 : x] !== 0 && this.prev_sync_phase >= (params.sync[sync ? 0 : x]/sampleRate)) {
          this.phase = 0
          back = x
        
        }
        this.prev_sync_phase = this.sync_phase
        const main = (params.frequency[freq ? 0 : x] * (x-back)) / sampleRate;
        // noise
        if (params.wave[wave ? 0 : x] > 4) {
          out[x] = Math.random() 
        }
        // sine wave made using bulit-in Math.sin
        if (params.wave[wave ? 0 : x] > 3) {
          out[x] = Math.sin(
            (main + this.phase + params.phase[phase ? 0 : x]) * 2 * Math.PI
          );
          // sawtooth wave using linear piecewise floor
        } else if (params.wave[wave ? 0 : x] > 2) {
          out[x] = saw(main + this.phase + params.phase[phase ? 0 : x]);
          // pulse wave using difference of phase shifted saws
        } else if (params.wave[wave ? 0 : x] > 1) {
          const temp = main + this.phase + params.phase[phase ? 0 : x];
          out[x] = saw(temp) - saw(temp + params.duty[duty ? 0 : x]);
          // triangle wave using absolute value of amplitude shifted sawtooth wave
        } else if (params.wave[wave ? 0 : x] >= 0) {
          out[x] =
            2 *
            Math.abs(
              saw(main + this.phase + params.phase[phase ? 0 : x]) - 1 / 2
            );
        }
        this.prev_sync_phase += 1 / sampleRate;
      }
      this.phase +=
        (params.frequency[freq ? 0 : outlen - 1] * outlen) / sampleRate;
      this.phase %= sampleRate;
      return true;
    }
  }
}

registerProcessor("better-oscillator", BetterOscillatorProcessor);
