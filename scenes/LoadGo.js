class LoadGo extends Phaser.Scene {
    constructor() {
        super('loadgo');
    }
    preload() {
        // load all assets used in the game
        this.load.path = 'assets/';
        this.load.image('logo', 'badOmenV3.png');
        this.load.image('joint0', 'joint0.png')
        this.load.image('joint1', 'joint1.png')
        this.load.image('bone0', 'bone0.png')
        this.load.image('bone1', 'bone1.png')
        this.load.image('hand', 'hand.png')
    }
    create() {
        
        let logoScale = 0.7;
        let chosenScreenX = 1080;
        let chosenScreenY = 2000;
        let logoOffsetX = 0;

        this.bg = this.add.rectangle(0, 0, chosenScreenX * 2, chosenScreenY * 2, 0xffffff, 1);

        this.logo = this.add.image(-(chosenScreenX/2 - ('logo'.length)), chosenScreenY/2 - ('logo'.length + 20), 'logo');
        this.logo.setScale(logoScale);

        this.tweens.add({
            targets: this.logo,
            x: chosenScreenX/2 - ('logo'.length) - logoOffsetX,
            y: chosenScreenY/2 - ('logo'.length + 20),
            duration: 1250,
            ease: 'Quart.easeInOut',
        });

        this.tagline = this.add.text(
            -9000,
            chosenScreenY/2 - 75,
            "Bad Tagline, Good Games",
            {fontFamily: "Gill Sans MT", fontWeight: "bold", fontSize: "50px", color: "#000000"}
        );

        this.tweens.add({
            targets: this.tagline,
            x: ((chosenScreenX/2) - 'logo'.length * 18) - logoOffsetX,
            alpha: 0,
            duration: 0,
        });

        this.tweens.add({
            targets: this.tagline,
            y: chosenScreenY/2 + 'logo'.length * 38,
            alpha: 1,
            delay: 1500,
            duration: 350,
            ease: 'Quart.easeInOut',
        });

        this.tweens.add({
            targets: this.logo,
            alpha: 0,
            delay: 3000,
            duration: 1250,
            ease: 'Quart.easeInOut',
        });

        this.tweens.add({
            targets: this.tagline,
            alpha: 0,
            delay: 3000,
            duration: 1250,
            ease: 'Quart.easeInOut',
        });

        this.swap = this.input.keyboard.addKey('SPACE')
    }

    update(time) {
        this.scene.start('lvl1');
        if (time/1000 > 5.5 || Phaser.Input.Keyboard.JustDown(this.swap)) {
            this.scene.start('lvl1');
        }
    }
}