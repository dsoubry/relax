export class RelaxVisualizer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.intensity = 0.55;
    this.isPlaying = false;
    this.animationId = null;
    this.startTime = performance.now();
  }

  start() {
    this.isPlaying = true;
    if (!this.animationId) this.draw();
  }

  stop() {
    this.isPlaying = false;
  }

  setIntensity(value) {
    this.intensity = Math.max(0, Math.min(1, value));
  }

  draw = () => {
    const { ctx, canvas } = this;
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const time = (performance.now() - this.startTime) / 1000;
    const cssAccent = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() || '#FF9F1C';

    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.translate(cx, cy);

    for (let layer = 0; layer < 4; layer++) {
      const points = 180;
      const baseRadius = 145 - layer * 18;
      const amplitude = (this.isPlaying ? 20 : 8) * this.intensity * (1 - layer * 0.14);

      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const angle = (Math.PI * 2 * i) / points;
        const wobble = Math.sin(angle * 5 + time * 1.4 + layer) + Math.cos(angle * 9 - time * 0.85);
        const radius = baseRadius + wobble * amplitude;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = cssAccent;
      ctx.globalAlpha = 0.72 - layer * 0.13;
      ctx.lineWidth = 2.2 - layer * 0.25;
      ctx.shadowBlur = 24;
      ctx.shadowColor = cssAccent;
      ctx.stroke();
    }

    ctx.globalAlpha = 0.20;
    for (let i = 0; i < 520; i++) {
      const angle = i * 2.399963;
      const radius = Math.sqrt(i) * 6.2 + Math.sin(time + i) * this.intensity * 2;
      ctx.fillStyle = cssAccent;
      ctx.fillRect(Math.cos(angle) * radius, Math.sin(angle) * radius, 1.6, 1.6);
    }

    ctx.restore();
    this.animationId = requestAnimationFrame(this.draw);
  };
}
