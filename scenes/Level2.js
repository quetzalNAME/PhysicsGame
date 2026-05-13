class Level2 extends Phaser.Scene {
    constructor() {
        super('lvl2');
    }
    create () {


        // background
        this.bg = this.add.image(chosenScreenX/2, chosenScreenY/2 - 250, 'bg')
            .setScale(0.35, 0.55)
            .setTint(0x505070)
            .setAlpha(0.5);

        // text
        this.title = this.add.text(75, 50, 'Catch the Stars.', {fontFamily: "Shadows Into Light", fontSize: '150px'});

        // variables
        this.since_fall = 0;
        this.since_fall_offset = 0;
        this.since_fall_offset_offset = 0;
        let stiff_val = 0.9;
        let loose_val = 0.005;
        let scale = 0.7; // scale effects everything without changing proportions
        let radius = {'joint0': 110 * scale, 'joint1': 60 * scale, 'hand': 50 * scale, 'tip': 30 * scale};
        let length = {'bone0': 300 * scale, 'bone1': 250 * scale, 'pencil': 250 * scale};
        let width = {'bone0': 120 * scale, 'bone1': 110 * scale, 'pencil': 50 * scale};
        let slop_val = 3;
        let arm_x = 1080*2/4;
        let arm_y = 1920*6/8;

        // drawing
        let first = true;
        const lineCategory = this.matter.world.nextCategory();
        const ballsCategory = this.matter.world.nextCategory();
        const sides = 4;
        const size = 14;
        const distance = size;
        const stiffness = 0.1;
        const lastPosition = new Phaser.Math.Vector2();
        const options = { friction: 0, frictionAir: 0, restitution: 0, ignoreGravity: true, inertia: Infinity, isStatic: true, angle: 0, collisionFilter: { category: lineCategory } };
        let current = null;
        let previous = null;
        const curves = [];
        let curve = null;
        const graphics = this.add.graphics();
        
        // segment0
        this.bone0 = this.matter.add.image(arm_x, arm_y, 'bone0')
            .setScale(0.9 * scale)
            .setTint(0xf0f0ff)
            .setRectangle(width['bone0'], length['bone0'], {slop: slop_val, ignoreGravity: true, collisionFilter: {category: 0x0010, mask: 0x1010}, mass: 5});
        this.joint0 = this.matter.add.image(arm_x, arm_y, 'joint0')
            .setScale(0.8 * scale)
            .setTint(0xe0e0f0)
            .setCircle(radius['joint0'], {slop: slop_val, isStatic: true, collisionFilter: {category: 0x0010, mask: 0x0011}});

        // segment1
        this.bone1 = this.matter.add.image(arm_x, arm_y, 'bone1')
            .setScale(0.7 * scale)
            .setTint(0xf0f0ff)
            .setRectangle(width['bone1'], length['bone1'], {slop: slop_val, ignoreGravity: true, collisionFilter: {category: 0x0100, mask: 0x0110}, mass: 5});
        this.joint1 = this.matter.add.image(arm_x, arm_y, 'joint1')
            .setScale(0.55 * scale)
            .setTint(0xf0f0ff)
            .setCircle(radius['joint1'], {slop: slop_val, collisionFilter: {category: 0x0010, mask: 0x0110}});

        // hand + pencil (segment2)
        this.hand = this.matter.add.image(arm_x - 500, arm_y, 'hand')
        .setScale(0.5 * scale)
        .setTint(0xf0f0ff)
        .setCircle(radius['hand'], {ignoreGravity: true, collisionFilter: {category: 0x0100, mask: 0x0100}, mass: 5})
        this.pencil = this.matter.add.image(arm_x -500, arm_y, 'pencil')
        .setScale(1 * scale)
        .setTint(0xf0f0ff)
        .setRectangle(width['pencil'], length['pencil'], {slop: 0, ignoreGravity: true, collisionFilter: {category: 0x0100, mask: 0x1100}, mass: 0.1, pointA: {y: 1000}});

        // pencil tip
        this.tip = this.matter.add.image(arm_x, arm_y, 'pencil')
        .setScale(0.0001 * scale)
        .setTint(0x000000)
        .setCircle(radius['tip'], {ignoreGravity: true, collisionFilter: {category: 0x1100, mask: 0x1100, mass: 0.1}});

        // constraints
        this.constraint0 = this.matter.add.constraint(this.joint0, this.bone0, radius['joint0'], stiff_val, {pointB: {x: 0, y: length['bone0']/2 - slop_val}});
        this.constraint1 = this.matter.add.constraint(this.bone0, this.joint1, radius['joint1'], stiff_val, {pointA: {x: 0, y: -length['bone0']/2 + slop_val}});
        this.constraint2 = this.matter.add.constraint(this.joint1, this.bone1, radius['joint1'], stiff_val, {pointB: {x: 0, y: length['bone1']/2 - slop_val}});
        this.constraint3 = this.matter.add.constraint(this.bone1, this.hand, radius['hand'], stiff_val, {pointA: {x: 0, y: -length['bone1']/2 + slop_val}});
        this.constraint4 = this.matter.add.worldConstraint(this.hand, 0, loose_val, {pointA: {x: 500, y: chosenScreenY - 300}});
        this.constraint5 = this.matter.add.constraint(this.hand, this.pencil, radius['hand'], stiff_val, {pointB: {x: 0, y: length['pencil']/2 - slop_val}});
        this.constraint6 = this.matter.add.constraint(this.pencil, this.tip, radius['tip'], stiff_val, {pointA: {x: 0, y: -length['pencil']/2 + slop_val}});
        this.constraint7 = this.matter.add.worldConstraint(this.tip, 0, loose_val/5, {pointA: {x: chosenScreenX/2, y: 0}});

        // stars
        this.stars = [];
        for (let i = 0; i < 3; i++) {
            this.stars[i] = this.matter.add.image((chosenScreenX/2) - 300 + (300*i), -100, 'star')
            .setScale(1.5 * scale)
            .setCircle()
            .setBounce(0.7)
            .setTint(0xffff70);
        }

        // control zone
        this.trackpad = this.add.image(chosenScreenX/2, chosenScreenY*7/8 - 15, 'trackpad')
            .setScale(2.75 *3/4, 1.75 *3/4)
            .setTint(0xeaf0ff)
            .setInteractive();


        // hand movement
        this.trackpad.on('pointermove', (pointer) =>
        {
            this.constraint4.pointA.x = (pointer.x - 75) * 1.15;
            this.constraint4.pointA.y = (pointer.y - 1920*6/8) * 4;
            this.constraint7.pointA.x = this.constraint4.pointA.x;

            // drawing
            if (first) {
                first = false;
                lastPosition.x = this.tip.x;
                lastPosition.y = this.tip.y;
                previous = this.matter.add.polygon(this.tip.x, this.tip.y, sides, size, options);
                curve = new Phaser.Curves.Spline([ this.tip.x, this.tip.y ]);
                curves.push(curve);
            }

            const x = this.tip.x;
            const y = this.tip.y;

            if (Phaser.Math.Distance.Between(x, y, lastPosition.x, lastPosition.y) > distance)
            {
                options.angle = Phaser.Math.Angle.Between(x, y, lastPosition.x, lastPosition.y);

                lastPosition.x = x;
                lastPosition.y = y;

                current = this.matter.add.polygon(this.tip.x, this.tip.y, sides, size, options);

                this.matter.add.constraint(previous, current, distance, stiffness);

                previous = current;

                curve.addPoint(x, y);

                graphics.clear();
                graphics.lineStyle(size * 1.5, 0x333333);

                curves.forEach(c =>
                {
                    c.draw(graphics, 64);
                });
            }
        });
        
        // end text
        this.retry = this.add.text(-9000, 900, 'Retry', {fontFamily: "Shadows Into Light", fontSize: '150px'}).setInteractive();
        this.next = this.add.text(-9000, 1200, 'Next', {fontFamily: "Shadows Into Light", fontSize: '150px'}).setInteractive();
        this.exit = this.add.text(-9000, 1500, 'Exit', {fontFamily: "Shadows Into Light", fontSize: '150px'}).setInteractive();
        this.retry.on('pointerup', () =>
        {
            this.scene.restart();
        });
        this.next.on('pointerup', () =>
        {
            this.scene.start('win');
        });
        this.exit.on('pointerup', () =>
        {
            this.scene.start('lvlselect');
        });
        
        // filters
        this.cameras.main.filters.external.addShadow(0, 0, 0.01, 100, 0x000000, 1000, 350);
        this.cameras.main.filters.external.addVignette(0.5, 0.5, 1, 0.15);
    }
    update (time) {
        if (this.since_fall_offset_offset == 0) {
            this.since_fall_offset_offset = time;
        }
        this.since_fall = (time - this.since_fall_offset) - this.since_fall_offset_offset;
        for (let i = 0; i < 3; i++) {
            if (this.stars[i].y > chosenScreenY + 100 || (this.stars[i].x > chosenScreenX + 50 || this.stars[i].x < - 50)) {
                this.since_fall_offset = time - this.since_fall_offset_offset;
                this.stars[i].y = -100;
                this.stars[i].x = chosenScreenX/2;
                this.stars[i].setToSleep();
                this.tweens.add({
                    targets: this.stars[i],
                    duration: 750,
                    y: -100,
                    onComplete: () =>
                    {
                        this.stars[i].setAwake();
                    }
                });
            }
        }
        if (this.since_fall >= 5000) {
            this.stars[0].x = this.cameras.main.scrollX + chosenScreenX/2 - 300;
            this.stars[1].x = this.cameras.main.scrollX + chosenScreenX/2;
            this.stars[2].x = this.cameras.main.scrollX + chosenScreenX/2 + 300;
            this.stars[0].y = 450;
            this.stars[1].y = 450;
            this.stars[2].y = 450;
            this.stars[0].setScale(4 * scale);
            this.stars[1].setScale(5.25 * scale);
            this.stars[2].setScale(4 * scale);
            this.retry.x = 100;
            this.retry.y = 600;
            this.next.x = 700;
            this.next.y = 600;
            this.exit.x = 450;
            this.exit.y = 800;
            this.title.setTint(0xffffff);
            this.matter.world.pause();
        }
        else {
            this.title.text = `Catch the Stars.\n${Math.floor(11 - (time - this.since_fall_offset_offset) / 1000)}`
            if (Math.floor(11 - (time - this.since_fall_offset_offset) / 1000) < 0) {
                this.title.setTint(0xff0000);
            }
        }
        if (this.since_fall_offset >= 10000) {
            this.since_fall = 0;
            this.since_fall_offset = 0;
            this.since_fall_offset_offset = 0;
            this.scene.restart();
        }
    }
}