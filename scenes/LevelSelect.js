class LevelSelect extends Phaser.Scene {
    constructor() {
        super('lvlselect');
    }
    levelSetup(tint) {
        // bounds
        this.matter.world.setBounds();
        // background
        this.bg = this.add.image(chosenScreenX/2, chosenScreenY/2 - 250, 'bg')
            .setScale(0.32)
            .setTint(tint)
            .setAlpha(0.5);
        // filters
        this.cameras.main.filters.external.addShadow(0, 0, 0.01, 100, 0x000000, 1000, 350);
        this.cameras.main.filters.external.addVignette(0.5, 0.5, 1, 0.15);
    }
    buildArm(
    arm_x, arm_y, scale, stiff_val = 0.9, loose_val = 0.005, slop_val = 3,
    radius  = {'joint0': 110 * scale, 'joint1': 60 * scale, 'hand': 50 * scale},
    length = {'bone0': 300 * scale, 'bone1': 250 * scale, 'bat': 550 * scale},
    width = {'bone0': 120 * scale, 'bone1': 110 * scale, 'bat': 100 * scale}) {
        this.cursor = this.add.image(offscreen, offscreen, 'cursor')
            .setScale(0.5)
            .setAlpha(0.5);
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
        // hand (segment2)
        this.hand = this.matter.add.image(arm_x, arm_y, 'hand')
            .setScale(0.5 * scale)
            .setTint(0xf0f0ff)
            .setCircle(radius['hand'], {ignoreGravity: true, collisionFilter: {category: 0x0100, mask: 0x0101}, mass: 5});
        // connections (constraints)
        // joint0->bone0
        this.constraint0 = this.matter.add.constraint(this.joint0, this.bone0, radius['joint0'], stiff_val, {pointB: {x: 0, y: length['bone0']/2 - slop_val}});
        // bone0->joint1
        this.constraint1 = this.matter.add.constraint(this.bone0, this.joint1, radius['joint1'], stiff_val, {pointA: {x: 0, y: -length['bone0']/2 + slop_val}});
        // joint1->bone1
        this.constraint2 = this.matter.add.constraint(this.joint1, this.bone1, radius['joint1'], stiff_val, {pointB: {x: 0, y: length['bone1']/2 - slop_val}});
        // bone1->hand
        this.constraint3 = this.matter.add.constraint(this.bone1, this.hand, radius['hand'], stiff_val, {pointA: {x: 0, y: -length['bone1']/2 + slop_val}});
        // hand--->cursor
        this.constraint4 = this.matter.add.worldConstraint(this.hand, 0, loose_val, {pointA: {x: chosenScreenX/2, y: 350}});
        // this.cursor = this.add.image(offscreen, offscreen, 'cursor')
        //     .setScale(0.5)
        //     .setAlpha(0.5);
    }
    // uiSetup('0. Tutorial') adds pause, trackpad, and name text
    create () {
        // generic setup
        this.levelSetup(bgBlue);

        // text
        this.add.text(75, 50, 'Level Select:', {fontFamily: "Shadows Into Light", fontSize: '150px'});

        // variables
        let arm_x = chosenScreenX/2 + 300;
        let arm_y = chosenScreenY*2/8;
        let scale = 0.25; // scale effects everything without changing proportions

        // build the arm
        this.buildArm(arm_x, arm_y, scale);

        // control zone
        this.trackpad = this.add.image(chosenScreenX/2, chosenScreenY*7/8 - 15, 'trackpad')
            .setScale(2.75 *3/4, 1.75 *3/4)
            .setTint(0xeaf0ff)
            .setInteractive();

        // hand movement
        this.trackpad.on('pointermove', (pointer) =>
        {
            this.constraint4.pointA.x = (pointer.x - 75) * 1.15;
            this.constraint4.pointA.y = (pointer.y - chosenScreenY*6/8) * 3.5;
        });

        // end text
        this.one = this.add.text(chosenScreenX/2, 400, 'Tutorial', {fontFamily: "Shadows Into Light", fontSize: '150px'}).setInteractive();
        this.two = this.add.text(chosenScreenX/2, 700, 'BATTER UP!', {fontFamily: "Shadows Into Light", fontSize: '150px'}).setInteractive();
        this.three = this.add.text(chosenScreenX/2, 1000, 'Drawing', {fontFamily: "Shadows Into Light", fontSize: '150px'}).setInteractive();
        this.one.on('pointerup', () =>
        {
            this.scene.start('lvl0');
        });
        this.two.on('pointerup', () =>
        {
            this.scene.start('lvl1');
        });
        this.three.on('pointerup', () =>
        {
            this.scene.start('lvl2');
        });
    }
    update () {
    }
}