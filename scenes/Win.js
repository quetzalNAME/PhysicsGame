class Win extends Phaser.Scene {
    constructor() {
        super('win');
    }
    create () {
        // world bounds
        this.matter.world.setBounds();

        // background
        this.bg = this.add.image(chosenScreenX/2, chosenScreenY/2 - 250, 'bg')
            .setScale(0.32, 0.6)
            .setTint(0x505070)
            .setAlpha(0.5);

        // text
        this.add.text(10, 300, 'You Won!\nThanks for playing.', {fontFamily: "Shadows Into Light", fontSize: '140px', align: 'center'});

        // logo
        this.add.image(850, 1800, 'logo')
        .setScale(0.25);

        // variables
        let stiff_val = 0.9;
        let loose_val = 0.005;
        let scale = 0.25; // scale effects everything without changing proportions
        let radius = {'joint0': 110 * scale, 'joint1': 60 * scale, 'hand': 50 * scale};
        let length = {'bone0': 300 * scale, 'bone1': 250 * scale, 'bat': 550 * scale};
        let width = {'bone0': 120 * scale, 'bone1': 110 * scale, 'bat': 100 * scale};
        let slop_val = 3;
        let arm_x = chosenScreenX/2 + 300;
        let arm_y = chosenScreenY*2/8;

        this.one = this.add.text(chosenScreenX/2 - 450, 900, 'To Level Select', {fontFamily: "Shadows Into Light", fontSize: '150px'}).setInteractive();
        this.one.on('pointerup', () =>
        {
            this.scene.start('lvlselect');
        });
        
        // filters
        this.cameras.main.filters.external.addShadow(0, 0, 0.01, 100, 0x000000, 1000, 350);
        this.cameras.main.filters.external.addVignette(0.5, 0.5, 1, 0.15);
    }
    update () {
    }
}