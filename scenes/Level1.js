class Level1 extends Phaser.Scene {
    constructor() {
        super('lvl1');
    }
    create () {
        // world bounds
        this.matter.world.setBounds();

        // floor / control zone
        this.floor = this.add.rectangle(1080/2, 1920*7/8, 1080, 500, 0x303030, 1).setInteractive();
        let rect = this.matter.add.rectangle(1080/2, 1920*7/8, 1080, 500, {isStatic: true});

        // variables
        let stiff_val = 0.9;
        let loose_val = 0.001;
        let radius = {'joint0': 100, 'joint1': 60, 'cursor_col': 50};
        let length = {'bone0': 300, 'bone1': 250};
        let width = {'bone0': 75, 'bone1': 75};
        
        // segment0
        this.joint0 = this.matter.add.circle(0, 1920*3.5/8, radius['joint0'], {isStatic: true});
        this.bone0 = this.matter.add.rectangle(0, 400/2, width['bone0'], length['bone0'], {ignoreGravity: true, mass: 5});

        // segment1
        this.joint1 = this.matter.add.circle(0, 0, radius['joint1'], {slop: 10, ignoreGravity: true, mass: 5});
        this.bone1 = this.matter.add.rectangle(0, 400/2, width['bone1'], length['bone1'], {ignoreGravity: true, mass: 5});

        // offset cursor
        this.cursor_col = this.matter.add.circle(500, 750, radius['cursor_col'], {ignoreGravity: true, mass: 5});

        // constraints
        this.constraint0 = this.matter.add.constraint(this.joint0, this.bone0, radius['joint0'], stiff_val, {pointB: {x: 0, y: length['bone0']/2 - 10}});
        this.constraint1 = this.matter.add.constraint(this.bone0, this.joint1, radius['joint1'], stiff_val, {pointA: {x: 0, y: -length['bone0']/2 + 10}});
        this.constraint2 = this.matter.add.constraint(this.joint1, this.bone1, radius['joint1'], stiff_val, {pointB: {x: 0, y: length['bone1']/2 - 10}});
        this.constraint3 = this.matter.add.constraint(this.bone1, this.cursor_col, radius['cursor_col'], stiff_val, {pointA: {x: 0, y: -length['bone1']/2 + 10}});
        this.constraint4 = this.matter.add.worldConstraint(this.cursor_col, 0, loose_val, {pointA: {x: 500, y: 750}});

        // spawn boxes
        for (let i = 0; i < 4; i++) {
            this.matter.add.rectangle(750 + i*100, 100, 150, 150);
        }

        this.floor.on('pointermove', (pointer) =>
        {
            this.constraint4.pointA.x = pointer.x;
            this.constraint4.pointA.y = (pointer.y - 1920*6/8) * 3;
        });

        // mouse interaction
        this.matter.add.mouseSpring();
    }
    update () {

    }
}