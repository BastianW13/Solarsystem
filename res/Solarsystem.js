class Solarsystem
{
  static init()
  {
    this.center = null;
    this.stars = new Map();
    this.planets = new Map();
    this.moons = new Map();
  }

  static setup()
  {
    this.center = new Point(0, 0);
    let obj = null;
    fetch('./res/objects.json')
    .then(result => result.json())
    .then(objects => {
      // Stars
      objects.stars.forEach(s => {
        obj = new Star(s.center, s.radiusSize);
        this.stars.set(s.name, obj);
      });
      // Planets
      objects.planets.forEach(p => {
        let s = this.stars.get(p.star)
        obj = new Planet(s, p.radiusRot, p.radiusSize, p.rotationTime, p.color || undefined, p.retrograde || undefined);
        this.planets.set(p.name, obj);
      });
      // Moons
      objects.moons.forEach(m => {
        let p = this.planets.get(m.planet);
        obj = new Moon(p, m.radiusRot, m.radiusSize, m.rotationTime, m.color || undefined, m.retrograde || undefined);
        this.moons.set(m.name, obj);
      })
    });
  }

  static update(deltaTime)
  {
    this.planets.forEach(planet => {
      planet.update(deltaTime);
    })
    this.moons.forEach(moon => {
      moon.update(deltaTime);
    })
  }

  static output()
  {
    // Focus
    let focus = this.stars.get(settings.focus) || this.planets.get(settings.focus) || this.moons.get(settings.focus);
    settings.offsetX = focus? (focus.pos.x - CVS_MAIN.width/2) : settings.offsetX;
    settings.offsetY = focus? (focus.pos.y - CVS_MAIN.height/2) : settings.offsetY;
    // Clear canvas
    CTX_MAIN.clearRect(0, 0, CVS_MAIN.width, CVS_MAIN.height);
    // Output stars
    this.stars.forEach((star) => {
      star.output(settings.offsetX, settings.offsetY);
    })
    // Output planets
    this.planets.forEach(planet => {
      planet.output(settings.offsetX, settings.offsetY);
    });
    // Output moons
    this.moons.forEach(moon => {
      moon.output(settings.offsetX, settings.offsetY);
    })
  }

  static findObject(posX, posY)
  {
    let object = 0;

    this.planets.forEach((planet, name) => {
      if (posX < planet.pos.x + planet.radiusSize() && posX > planet.pos.x - planet.radiusSize() &&
          posY < planet.pos.y + planet.radiusSize() && posY > planet.pos.y - planet.radiusSize()
      )
      {
        object = name;
      }
    })
    this.moons.forEach((moon, name) => {
      if (posX < moon.pos.x + moon.radiusSize() && posX > moon.pos.x - moon.radiusSize() &&
          posY < moon.pos.y + moon.radiusSize() && posY > moon.pos.y - moon.radiusSize())
      {
        object = name;
      }
    })
    return object;
  }
}
