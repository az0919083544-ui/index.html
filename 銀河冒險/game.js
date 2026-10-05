window.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // HTML 元件
    // ==========================================

    const menuScreen =
        document.getElementById("menuScreen");

    const gameScreen =
        document.getElementById("gameScreen");

    const resultScreen =
        document.getElementById("resultScreen");

    const startButton =
        document.getElementById("startButton");

    const restartButton =
        document.getElementById("restartButton");

    const homeButton =
        document.getElementById("homeButton");

    const canvas =
        document.getElementById("gameCanvas");

    const ctx =
        canvas.getContext("2d");


    const hpText =
        document.getElementById("hpText");

    const attackText =
        document.getElementById("attackText");

    const scoreText =
        document.getElementById("scoreText");

    const levelText =
        document.getElementById("levelText");

    const planetText =
        document.getElementById("planetText");

    const difficultyText =
        document.getElementById("difficultyText");

    const difficultyDescription =
        document.getElementById(
            "difficultyDescription"
        );

    const resultTitle =
        document.getElementById(
            "resultTitle"
        );

    const resultMessage =
        document.getElementById(
            "resultMessage"
        );

    const finalScore =
        document.getElementById(
            "finalScore"
        );


    // ==========================================
    // 難度設定
    // ==========================================

    const difficultySettings = {

        easy: {

            name: "簡單",

            description:
                "玩家攻擊力高、小怪血量低",

            playerAttack: 6,

            enemyHp: 2,

            enemyHpPerLevel: 1,

            enemyDefense: 0,

            enemyDefensePerLevel: 0.2,

            enemySpeed: 0.7,

            enemySpeedPerLevel: 0.05,

            obstacleSpeed: 0.5,

            bossHp: 180,

            bossDefense: 3,

            bossDamage: 0.7,

            bossSpeed: 1.0,

            bossBulletDamage: 5,

            bossBulletSpeed: 3.0

        },


        normal: {

            name: "標準",

            description:
                "玩家攻擊力普通、小怪血量提高",

            playerAttack: 2,

            enemyHp: 4,

            enemyHpPerLevel: 1.5,

            enemyDefense: 1,

            enemyDefensePerLevel: 0.5,

            enemySpeed: 0.9,

            enemySpeedPerLevel: 0.1,

            obstacleSpeed: 0.8,

            bossHp: 300,

            bossDefense: 5,

            bossDamage: 1.0,

            bossSpeed: 1.2,

            bossBulletDamage: 8,

            bossBulletSpeed: 3.5

        },


        hard: {

            name: "困難",

            description:
                "小怪很厚、Boss 很強、障礙物更快",

            playerAttack: 1,

            enemyHp: 7,

            enemyHpPerLevel: 2.5,

            enemyDefense: 2,

            enemyDefensePerLevel: 1,

            enemySpeed: 1.1,

            enemySpeedPerLevel: 0.18,

            obstacleSpeed: 1.3,

            bossHp: 600,

            bossDefense: 10,

            bossDamage: 2.2,

            bossSpeed: 1.6,

            bossBulletDamage: 12,

            bossBulletSpeed: 4.2

        }

    };


    let selectedDifficulty = "normal";

    let difficulty =
        difficultySettings.normal;


    // ==========================================
    // 六個行星
    // ==========================================

    const planets = [

        {
            name: "🌍 藍色地球",
            top: "#061b45",
            bottom: "#087b9b",
            obstacle: "meteor"
        },

        {
            name: "🔴 火星",
            top: "#300707",
            bottom: "#a83212",
            obstacle: "fireRock"
        },

        {
            name: "🪐 土星",
            top: "#34220a",
            bottom: "#b17b24",
            obstacle: "ice"
        },

        {
            name: "🟣 紫晶行星",
            top: "#16052d",
            bottom: "#792ca8",
            obstacle: "crystal"
        },

        {
            name: "🔥 熔岩行星",
            top: "#210000",
            bottom: "#b52905",
            obstacle: "lava"
        },

        {
            name: "🌑 黑暗行星",
            top: "#020206",
            bottom: "#25134d",
            obstacle: "energy"
        }

    ];


    // ==========================================
    // 遊戲變數
    // ==========================================

    let gameRunning = false;

    let level = 1;

    const maxLevel = 6;

    let score = 0;

    let enemies = [];

    let bullets = [];

    let enemyBullets = [];

    let obstacles = [];

    let boss = null;

    let keys = {};

    let mouseX =
        canvas.width / 2;

    let mouseY =
        canvas.height / 2;


    // ==========================================
    // 玩家
    // ==========================================

    const player = {

        x: 100,

        y: 300,

        width: 35,

        height: 35,

        speed: 4,

        hp: 100,

        maxHp: 100,

        attackPower: 2,

        direction: 1,

        attackCooldown: 0,

        shootCooldown: 0,

        attackRange: 170

    };


    // ==========================================
    // Boss 技能變數
    // ==========================================

    let bossShootTimer = 0;

    let bossTripleTimer = 0;

    let bossSummonTimer = 0;

    let bossLaserTimer = 0;

    let bossLaserActive = false;

    let bossLaserTime = 0;

    let bossLaserAngle = 0;

    let bossPhase = 1;


    // ==========================================
    // 敵人類型
    // ==========================================

    /*
        normal：
        普通敵人

        fast：
        高速敵人

        ranged：
        遠程敵人

        tank：
        坦克敵人
    */


    const enemyTypeSettings = {

        normal: {

            name: "普通怪",

            color: "#ff4d6d",

            hpMultiplier: 1,

            defenseBonus: 0,

            speedMultiplier: 1,

            damageMultiplier: 1,

            score: 100

        },


        fast: {

            name: "高速怪",

            color: "#ffd633",

            hpMultiplier: 0.65,

            defenseBonus: 0,

            speedMultiplier: 2.0,

            damageMultiplier: 1.2,

            score: 150

        },


        ranged: {

            name: "遠程怪",

            color: "#b34dff",

            hpMultiplier: 1.0,

            defenseBonus: 1,

            speedMultiplier: 0.65,

            damageMultiplier: 1.1,

            score: 200

        },


        tank: {

            name: "坦克怪",

            color: "#555b66",

            hpMultiplier: 2.8,

            defenseBonus: 3,

            speedMultiplier: 0.45,

            damageMultiplier: 1.8,

            score: 300

        }

    };


    // ==========================================
    // 難度按鈕
    // ==========================================

    const difficultyButtons =
        document.querySelectorAll(
            ".difficultyButton"
        );


    difficultyButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    selectedDifficulty =
                        button.dataset.difficulty;

                    difficulty =
                        difficultySettings[
                            selectedDifficulty
                        ];


                    difficultyButtons.forEach(
                        function (btn) {

                            btn.classList.remove(
                                "selected"
                            );

                        }
                    );


                    button.classList.add(
                        "selected"
                    );


                    difficultyDescription.textContent =
                        difficulty.description;

                }
            );

        }
    );


    document
        .querySelector(
            '[data-difficulty="normal"]'
        )
        .classList.add("selected");


    // ==========================================
    // 開始遊戲
    // ==========================================

    function startGame() {

        menuScreen.style.display =
            "none";

        resultScreen.style.display =
            "none";

        gameScreen.style.display =
            "flex";


        gameRunning = true;

        level = 1;

        score = 0;


        player.hp =
            player.maxHp;

        player.x = 100;

        player.y =
            canvas.height / 2;


        enemies = [];

        bullets = [];

        enemyBullets = [];

        obstacles = [];

        boss = null;


        resetBossSkills();


        createLevel();

        updateUI();

    }


    // ==========================================
    // Boss 技能初始化
    // ==========================================

    function resetBossSkills() {

        bossShootTimer = 100;

        bossTripleTimer = 180;

        bossSummonTimer = 350;

        bossLaserTimer = 500;

        bossLaserActive = false;

        bossLaserTime = 0;

        bossLaserAngle = 0;

        bossPhase = 1;

    }


    // ==========================================
    // 建立關卡
    // ==========================================

    function createLevel() {

        enemies = [];

        bullets = [];

        enemyBullets = [];

        obstacles = [];

        boss = null;


        // 每關血量回滿

        player.hp =
            player.maxHp;


        player.x = 100;

        player.y =
            canvas.height / 2;


        // 玩家攻擊力隨關卡增加

        player.attackPower =
            difficulty.playerAttack;


        if (
            selectedDifficulty ===
            "easy"
        ) {

            player.attackPower +=
                (level - 1) * 1.5;

        }

        else if (
            selectedDifficulty ===
            "normal"
        ) {

            player.attackPower +=
                (level - 1) * 0.5;

        }

        else {

            player.attackPower +=
                (level - 1) * 0.3;

        }


        // ======================================
        // 根據關卡決定敵人種類
        // ======================================

        let enemyTypes = [];


        if (level === 1) {

            enemyTypes = [
                "normal"
            ];

        }

        else if (level === 2) {

            enemyTypes = [
                "normal",
                "fast"
            ];

        }

        else if (level === 3) {

            enemyTypes = [
                "normal",
                "fast",
                "ranged"
            ];

        }

        else if (level === 4) {

            enemyTypes = [
                "normal",
                "fast",
                "ranged"
            ];

        }

        else if (level === 5) {

            enemyTypes = [
                "normal",
                "fast",
                "ranged",
                "tank"
            ];

        }

        else if (level === 6) {

            enemyTypes = [
                "normal",
                "fast",
                "ranged",
                "tank"
            ];

        }


        // ======================================
        // 敵人數量
        // ======================================

        let enemyCount =
            2 + level;


        if (level === 4) {

            enemyCount = 7;

        }

        if (level === 5) {

            enemyCount = 8;

        }

        if (level === 6) {

            enemyCount = 7;

        }


        // ======================================
        // 產生敵人
        // ======================================

        for (
            let i = 0;
            i < enemyCount;
            i++
        ) {

            const type =
                enemyTypes[
                    Math.floor(
                        Math.random() *
                        enemyTypes.length
                    )
                ];


            createEnemy(type);

        }


        // ======================================
        // 障礙物
        // ======================================

        let obstacleCount = 3;


        if (level >= 4) {

            obstacleCount = 4;

        }


        if (level === 6) {

            obstacleCount = 5;

        }


        for (
            let i = 0;
            i < obstacleCount;
            i++
        ) {

            createObstacle();

        }


        // ======================================
        // 第六關 Boss
        // ======================================

        if (level === 6) {

            createBoss();

        }


        updateUI();

    }


    // ==========================================
    // 建立敵人
    // ==========================================

    function createEnemy(type) {

        const setting =
            enemyTypeSettings[type];


        let x =
            450 +
            Math.random() * 480;


        let y =
            60 +
            Math.random() * 480;


        const baseHp =
            difficulty.enemyHp +
            (level - 1) *
            difficulty.enemyHpPerLevel;


        const hp =
            Math.max(
                1,
                baseHp *
                setting.hpMultiplier
            );


        const defense =
            difficulty.enemyDefense +
            (level - 1) *
            difficulty.enemyDefensePerLevel +
            setting.defenseBonus;


        const speed =
            (
                difficulty.enemySpeed +
                (level - 1) *
                difficulty.enemySpeedPerLevel
            ) *
            setting.speedMultiplier;


        const damage =
            (
                0.12 +
                level * 0.02
            ) *
            setting.damageMultiplier;


        enemies.push({

            type: type,

            x: x,

            y: y,

            width:
                type === "tank"
                    ? 55
                    : type === "fast"
                        ? 30
                        : 35,

            height:
                type === "tank"
                    ? 55
                    : type === "fast"
                        ? 30
                        : 35,

            hp: hp,

            maxHp: hp,

            defense: defense,

            speed: speed,

            damage: damage,

            hitFlash: 0,

            shootCooldown:
                120 +
                Math.random() * 100

        });

    }


    // ==========================================
    // Boss
    // ==========================================

    function createBoss() {

        boss = {

            x: 760,

            y: 220,

            width: 130,

            height: 130,

            hp:
                difficulty.bossHp,

            maxHp:
                difficulty.bossHp,

            defense:
                difficulty.bossDefense,

            speed:
                difficulty.bossSpeed,

            damage:
                difficulty.bossDamage,

            hitFlash: 0

        };


        resetBossSkills();

    }


    // ==========================================
    // 建立障礙物
    // ==========================================

    function createObstacle() {

        const type =
            planets[level - 1]
                .obstacle;


        obstacles.push({

            type: type,

            x:
                Math.random() *
                canvas.width,

            y:
                -50 -
                Math.random() * 400,

            size:
                20 +
                Math.random() * 20,

            speed:
                difficulty.obstacleSpeed +
                Math.random() * 0.5,

            rotation:
                Math.random() * 6.28

        });

    }


    // ==========================================
    // 鍵盤
    // ==========================================

    window.addEventListener(
        "keydown",
        function (event) {

            keys[event.code] = true;


            if (
                event.code === "Space"
            ) {

                event.preventDefault();


                if (gameRunning) {

                    attack();

                }

            }

        }
    );


    window.addEventListener(
        "keyup",
        function (event) {

            keys[event.code] = false;

        }
    );


    // ==========================================
    // 滑鼠
    // ==========================================

    canvas.addEventListener(
        "mousemove",
        function (event) {

            const rect =
                canvas.getBoundingClientRect();


            mouseX =
                (
                    event.clientX -
                    rect.left
                ) *
                (
                    canvas.width /
                    rect.width
                );


            mouseY =
                (
                    event.clientY -
                    rect.top
                ) *
                (
                    canvas.height /
                    rect.height
                );

        }
    );


    canvas.addEventListener(
        "mousedown",
        function (event) {

            if (
                event.button === 0 &&
                gameRunning
            ) {

                shoot();

            }

        }
    );


    // ==========================================
    // 玩家移動
    // ==========================================

    function updatePlayer() {

        if (keys["KeyW"])
            player.y -= player.speed;

        if (keys["KeyS"])
            player.y += player.speed;

        if (keys["KeyA"]) {

            player.x -= player.speed;

            player.direction = -1;

        }

        if (keys["KeyD"]) {

            player.x += player.speed;

            player.direction = 1;

        }


        player.x =
            Math.max(
                0,
                Math.min(
                    canvas.width -
                    player.width,
                    player.x
                )
            );


        player.y =
            Math.max(
                0,
                Math.min(
                    canvas.height -
                    player.height,
                    player.y
                )
            );


        if (
            player.attackCooldown > 0
        ) {

            player.attackCooldown--;

        }


        if (
            player.shootCooldown > 0
        ) {

            player.shootCooldown--;

        }

    }


    // ==========================================
    // 玩家射擊
    // ==========================================

    function shoot() {

        if (
            player.shootCooldown > 0
        )
            return;


        const startX =
            player.x +
            player.width / 2;


        const startY =
            player.y +
            player.height / 2;


        let dx =
            mouseX - startX;

        let dy =
            mouseY - startY;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (distance === 0)
            return;


        dx /= distance;
        dy /= distance;


        bullets.push({

            x: startX,

            y: startY,

            dx: dx,

            dy: dy,

            speed: 9,

            damage:
                player.attackPower,

            size: 6

        });


        player.shootCooldown = 8;

    }


    // ==========================================
    // 近戰
    // ==========================================

    function attack() {

        if (
            player.attackCooldown > 0
        )
            return;


        player.attackCooldown = 25;


        for (
            let i =
                enemies.length - 1;
            i >= 0;
            i--
        ) {

            const enemy =
                enemies[i];


            const dx =
                enemy.x -
                player.x;


            const dy =
                enemy.y -
                player.y;


            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (
                distance <=
                player.attackRange
            ) {

                const damage =
                    Math.max(
                        1,
                        player.attackPower -
                        enemy.defense
                    );


                enemy.hp -= damage;

                enemy.hitFlash = 5;


                if (
                    enemy.hp <= 0
                ) {

                    score +=
                        enemyTypeSettings[
                            enemy.type
                        ].score;


                    enemies.splice(i, 1);

                }

            }

        }


        // Boss

        if (boss !== null) {

            const dx =
                boss.x -
                player.x;


            const dy =
                boss.y -
                player.y;


            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (
                distance <=
                player.attackRange + 50
            ) {

                const damage =
                    Math.max(
                        1,
                        player.attackPower -
                        boss.defense
                    );


                boss.hp -= damage;

                boss.hitFlash = 5;


                if (
                    boss.hp <= 0
                ) {

                    boss = null;

                    score += 1000;

                }

            }

        }

    }


    // ==========================================
    // 玩家子彈
    // ==========================================

    function updateBullets() {

        for (
            let i =
                bullets.length - 1;
            i >= 0;
            i--
        ) {

            const bullet =
                bullets[i];


            bullet.x +=
                bullet.dx *
                bullet.speed;


            bullet.y +=
                bullet.dy *
                bullet.speed;


            if (

                bullet.x < -20 ||
                bullet.x >
                canvas.width + 20 ||
                bullet.y < -20 ||
                bullet.y >
                canvas.height + 20

            ) {

                bullets.splice(i, 1);

                continue;

            }


            let hit = false;


            // ==================================
            // 小怪
            // ==================================

            for (
                let j =
                    enemies.length - 1;
                j >= 0;
                j--
            ) {

                const enemy =
                    enemies[j];


                if (

                    bullet.x >
                    enemy.x &&

                    bullet.x <
                    enemy.x +
                    enemy.width &&

                    bullet.y >
                    enemy.y &&

                    bullet.y <
                    enemy.y +
                    enemy.height

                ) {

                    const damage =
                        Math.max(
                            1,
                            bullet.damage -
                            enemy.defense
                        );


                    enemy.hp -= damage;

                    enemy.hitFlash = 5;


                    if (
                        enemy.hp <= 0
                    ) {

                        score +=
                            enemyTypeSettings[
                                enemy.type
                            ].score;


                        enemies.splice(j, 1);

                    }


                    bullets.splice(i, 1);

                    hit = true;

                    break;

                }

            }


            if (hit)
                continue;


            // ==================================
            // Boss
            // ==================================

            if (
                boss !== null
            ) {

                if (

                    bullet.x >
                    boss.x &&

                    bullet.x <
                    boss.x +
                    boss.width &&

                    bullet.y >
                    boss.y &&

                    bullet.y <
                    boss.y +
                    boss.height

                ) {

                    const damage =
                        Math.max(
                            1,
                            bullet.damage -
                            boss.defense
                        );


                    boss.hp -= damage;

                    boss.hitFlash = 5;


                    bullets.splice(i, 1);


                    if (
                        boss.hp <= 0
                    ) {

                        boss = null;

                        score += 1000;

                    }

                }

            }

        }

    }


    // ==========================================
    // 遠程敵人射擊
    // ==========================================

    function enemyShoot(enemy) {

        const startX =
            enemy.x +
            enemy.width / 2;


        const startY =
            enemy.y +
            enemy.height / 2;


        let dx =
            (
                player.x +
                player.width / 2
            ) -
            startX;


        let dy =
            (
                player.y +
                player.height / 2
            ) -
            startY;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            distance === 0
        )
            return;


        dx /= distance;

        dy /= distance;


        enemyBullets.push({

            x: startX,

            y: startY,

            dx: dx,

            dy: dy,

            speed: 3.5,

            damage:
                3 +
                level * 0.5,

            size: 7,

            type: "enemy"

        });

    }


    // ==========================================
    // 更新小怪
    // ==========================================

    function updateEnemies() {

        for (
            const enemy of enemies
        ) {

            const dx =
                player.x -
                enemy.x;


            const dy =
                player.y -
                enemy.y;


            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            // ==================================
            // 普通怪 / 高速怪 / 坦克怪
            // ==================================

            if (
                enemy.type !== "ranged"
            ) {

                if (
                    distance > 0
                ) {

                    enemy.x +=
                        (
                            dx /
                            distance
                        ) *
                        enemy.speed;


                    enemy.y +=
                        (
                            dy /
                            distance
                        ) *
                        enemy.speed;

                }

            }


            // ==================================
            // 遠程怪
            // ==================================

            else {

                // 遠程怪保持距離

                if (
                    distance > 330
                ) {

                    enemy.x +=
                        (
                            dx /
                            distance
                        ) *
                        enemy.speed;


                    enemy.y +=
                        (
                            dy /
                            distance
                        ) *
                        enemy.speed;

                }

                else if (
                    distance < 230
                ) {

                    enemy.x -=
                        (
                            dx /
                            distance
                        ) *
                        enemy.speed;


                    enemy.y -=
                        (
                            dy /
                            distance
                        ) *
                        enemy.speed;

                }


                enemy.shootCooldown--;


                if (
                    enemy.shootCooldown <= 0
                ) {

                    enemyShoot(enemy);

                    enemy.shootCooldown =
                        100 +
                        Math.random() * 100;

                }

            }


            // ==================================
            // 碰撞
            // ==================================

            if (

                player.x <
                enemy.x +
                enemy.width &&

                player.x +
                player.width >
                enemy.x &&

                player.y <
                enemy.y +
                enemy.height &&

                player.y +
                player.height >
                enemy.y

            ) {

                player.hp -=
                    enemy.damage;

            }


            if (
                enemy.hitFlash > 0
            ) {

                enemy.hitFlash--;

            }

        }

    }


    // ==========================================
    // Boss 發射能量球
    // ==========================================

    function bossShoot() {

        if (
            boss === null
        )
            return;


        const startX =
            boss.x +
            boss.width / 2;


        const startY =
            boss.y +
            boss.height / 2;


        let dx =
            (
                player.x +
                player.width / 2
            ) -
            startX;


        let dy =
            (
                player.y +
                player.height / 2
            ) -
            startY;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            distance === 0
        )
            return;


        dx /= distance;
        dy /= distance;


        enemyBullets.push({

            x: startX,

            y: startY,

            dx: dx,

            dy: dy,

            speed:
                difficulty.bossBulletSpeed,

            damage:
                difficulty.bossBulletDamage,

            size: 10,

            type: "energy"

        });

    }


    // ==========================================
    // Boss 三連發
    // ==========================================

    function bossTripleShot() {

        if (
            boss === null
        )
            return;


        const startX =
            boss.x +
            boss.width / 2;


        const startY =
            boss.y +
            boss.height / 2;


        let baseAngle =
            Math.atan2(

                (
                    player.y +
                    player.height / 2
                ) -
                startY,

                (
                    player.x +
                    player.width / 2
                ) -
                startX

            );


        const angles = [

            baseAngle - 0.35,

            baseAngle,

            baseAngle + 0.35

        ];


        for (
            const angle of angles
        ) {

            enemyBullets.push({

                x: startX,

                y: startY,

                dx:
                    Math.cos(angle),

                dy:
                    Math.sin(angle),

                speed:
                    difficulty.bossBulletSpeed,

                damage:
                    difficulty.bossBulletDamage,

                size: 9,

                type: "triple"

            });

        }

    }


    // ==========================================
    // Boss 召喚
    // ==========================================

    function bossSummon() {

        if (
            boss === null
        )
            return;


        if (
            enemies.length >= 10
        )
            return;


        for (
            let i = 0;
            i < 2;
            i++
        ) {

            const types = [
                "normal",
                "fast",
                "ranged"
            ];


            const randomType =
                types[
                    Math.floor(
                        Math.random() *
                        types.length
                    )
                ];


            createBossMinion(
                randomType
            );

        }

    }


    function createBossMinion(type) {

        const setting =
            enemyTypeSettings[type];


        const hp =
            (
                difficulty.enemyHp +
                3 +
                level
            ) *
            setting.hpMultiplier;


        enemies.push({

            type: type,

            x:
                boss.x +
                Math.random() * 100 -
                50,

            y:
                boss.y +
                Math.random() * 100 -
                50,

            width:
                type === "fast"
                    ? 30
                    : 35,

            height:
                type === "fast"
                    ? 30
                    : 35,

            hp: hp,

            maxHp: hp,

            defense:
                difficulty.enemyDefense +
                1 +
                setting.defenseBonus,

            speed:
                (
                    difficulty.enemySpeed +
                    0.5
                ) *
                setting.speedMultiplier,

            damage:
                0.3 *
                setting.damageMultiplier,

            hitFlash: 0,

            shootCooldown: 100

        });

    }


    // ==========================================
    // Boss 雷射
    // ==========================================

    function startBossLaser() {

        if (
            boss === null
        )
            return;


        bossLaserActive = true;

        bossLaserTime = 100;


        bossLaserAngle =
            Math.atan2(

                (
                    player.y +
                    player.height / 2
                ) -
                (
                    boss.y +
                    boss.height / 2
                ),

                (
                    player.x +
                    player.width / 2
                ) -
                (
                    boss.x +
                    boss.width / 2
                )

            );

    }


    // ==========================================
    // Boss 技能更新
    // ==========================================

    function updateBossSkills() {

        if (
            boss === null
        )
            return;


        const hpPercent =
            boss.hp /
            boss.maxHp;


        if (
            hpPercent > 0.60
        ) {

            bossPhase = 1;

        }

        else if (
            hpPercent > 0.35
        ) {

            bossPhase = 2;

        }

        else {

            bossPhase = 3;

        }


        // 單發

        bossShootTimer--;


        if (
            bossShootTimer <= 0
        ) {

            bossShoot();

            bossShootTimer =
                bossPhase === 1
                    ? 100
                    : bossPhase === 2
                        ? 70
                        : 45;

        }


        // 三連發

        bossTripleTimer--;


        if (
            bossTripleTimer <= 0
        ) {

            bossTripleShot();

            bossTripleTimer =
                bossPhase === 1
                    ? 240
                    : bossPhase === 2
                        ? 160
                        : 100;

        }


        // 召喚

        if (
            hpPercent <= 0.60
        ) {

            bossSummonTimer--;


            if (
                bossSummonTimer <= 0
            ) {

                bossSummon();

                bossSummonTimer =
                    bossPhase === 2
                        ? 320
                        : 220;

            }

        }


        // 雷射

        if (
            hpPercent <= 0.35
        ) {

            bossLaserTimer--;


            if (
                bossLaserTimer <= 0 &&
                !bossLaserActive
            ) {

                startBossLaser();

                bossLaserTimer = 420;

            }

        }


        // 雷射造成傷害

        if (
            bossLaserActive
        ) {

            bossLaserTime--;


            const bossCenterX =
                boss.x +
                boss.width / 2;


            const bossCenterY =
                boss.y +
                boss.height / 2;


            const playerCenterX =
                player.x +
                player.width / 2;


            const playerCenterY =
                player.y +
                player.height / 2;


            const angleToPlayer =
                Math.atan2(
                    playerCenterY -
                    bossCenterY,

                    playerCenterX -
                    bossCenterX
                );


            const difference =
                Math.abs(
                    normalizeAngle(
                        angleToPlayer -
                        bossLaserAngle
                    )
                );


            if (
                difference < 0.12
            ) {

                player.hp -=
                    bossPhase === 3
                        ? 0.45
                        : 0.3;

            }


            if (
                bossLaserTime <= 0
            ) {

                bossLaserActive =
                    false;

            }

        }

    }


    // ==========================================
    // 角度
    // ==========================================

    function normalizeAngle(angle) {

        while (
            angle > Math.PI
        ) {

            angle -=
                Math.PI * 2;

        }


        while (
            angle < -Math.PI
        ) {

            angle +=
                Math.PI * 2;

        }


        return angle;

    }


    // ==========================================
    // Boss 移動
    // ==========================================

    function updateBoss() {

        if (
            boss === null
        )
            return;


        const dx =
            player.x -
            boss.x;


        const dy =
            player.y -
            boss.y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        let currentSpeed =
            boss.speed;


        if (
            boss.hp /
            boss.maxHp <
            0.35
        ) {

            currentSpeed *= 1.4;

        }


        if (
            distance > 180
        ) {

            boss.x +=
                (
                    dx /
                    distance
                ) *
                currentSpeed;


            boss.y +=
                (
                    dy /
                    distance
                ) *
                currentSpeed;

        }


        if (

            player.x <
            boss.x +
            boss.width &&

            player.x +
            player.width >
            boss.x &&

            player.y <
            boss.y +
            boss.height &&

            player.y +
            player.height >
            boss.y

        ) {

            player.hp -=
                boss.damage;

        }


        if (
            boss.hitFlash > 0
        ) {

            boss.hitFlash--;

        }


        updateBossSkills();

    }


    // ==========================================
    // 敵人子彈
    // ==========================================

    function updateEnemyBullets() {

        for (
            let i =
                enemyBullets.length - 1;
            i >= 0;
            i--
        ) {

            const bullet =
                enemyBullets[i];


            bullet.x +=
                bullet.dx *
                bullet.speed;


            bullet.y +=
                bullet.dy *
                bullet.speed;


            if (

                bullet.x < -50 ||
                bullet.x >
                canvas.width + 50 ||
                bullet.y < -50 ||
                bullet.y >
                canvas.height + 50

            ) {

                enemyBullets.splice(i, 1);

                continue;

            }


            if (

                bullet.x >
                player.x &&

                bullet.x <
                player.x +
                player.width &&

                bullet.y >
                player.y &&

                bullet.y <
                player.y +
                player.height

            ) {

                player.hp -=
                    bullet.damage;


                enemyBullets.splice(i, 1);

            }

        }

    }


    // ==========================================
    // 障礙物
    // ==========================================

    function updateObstacles() {

        for (
            const obstacle of obstacles
        ) {

            obstacle.y +=
                obstacle.speed;


            obstacle.rotation +=
                0.02;


            if (
                obstacle.y >
                canvas.height + 60
            ) {

                obstacle.y = -60;

                obstacle.x =
                    Math.random() *
                    canvas.width;

            }


            const dx =
                obstacle.x -
                (
                    player.x +
                    player.width / 2
                );


            const dy =
                obstacle.y -
                (
                    player.y +
                    player.height / 2
                );


            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (
                distance <
                obstacle.size + 22
            ) {

                player.hp -= 0.18;

            }

        }

    }


    // ==========================================
    // 關卡判斷
    // ==========================================

    function checkLevel() {

        // 第六關

        if (
            level === maxLevel
        ) {

            if (

                enemies.length === 0 &&
                boss === null

            ) {

                victory();

            }


            return;

        }


        // 前五關

        if (
            enemies.length === 0
        ) {

            level++;

            createLevel();

        }

    }


    // ==========================================
    // 勝利
    // ==========================================

    function victory() {

        if (!gameRunning)
            return;


        gameRunning = false;


        gameScreen.style.display =
            "none";


        resultScreen.style.display =
            "flex";


        resultTitle.textContent =
            "🏆 遊戲勝利！";


        resultMessage.textContent =
            "你成功探索六個行星並擊敗最終 Boss！";


        finalScore.textContent =
            score;

    }


    // ==========================================
    // 失敗
    // ==========================================

    function gameOver() {

        if (!gameRunning)
            return;


        gameRunning = false;


        gameScreen.style.display =
            "none";


        resultScreen.style.display =
            "flex";


        resultTitle.textContent =
            "💀 遊戲失敗";


        resultMessage.textContent =
            "你在第 " +
            level +
            " 關的「" +
            planets[level - 1].name +
            "」被擊敗了！";


        finalScore.textContent =
            score;

    }


    // ==========================================
    // UI
    // ==========================================

    function updateUI() {

        hpText.textContent =
            Math.max(
                0,
                Math.ceil(player.hp)
            );


        attackText.textContent =
            Math.round(
                player.attackPower
            );


        scoreText.textContent =
            score;


        levelText.textContent =
            level;


        planetText.textContent =
            planets[level - 1].name;


        difficultyText.textContent =
            difficulty.name;

    }


    // ==========================================
    // 背景
    // ==========================================

    function drawBackground() {

        const planet =
            planets[level - 1];


        const gradient =
            ctx.createLinearGradient(
                0,
                0,
                0,
                canvas.height
            );


        gradient.addColorStop(
            0,
            planet.top
        );


        gradient.addColorStop(
            1,
            planet.bottom
        );


        ctx.fillStyle =
            gradient;


        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        // 星星

        for (
            let i = 0;
            i < 100;
            i++
        ) {

            const x =
                (
                    i * 137
                ) %
                canvas.width;


            const y =
                (
                    i * 83
                ) %
                canvas.height;


            const size =
                1 +
                (
                    i % 3
                );


            ctx.fillStyle =
                "rgba(255,255,255,0.75)";


            ctx.fillRect(
                x,
                y,
                size,
                size
            );

        }


        // 行星

        if (
            level === 1
        ) {

            drawPlanet(
                820,
                130,
                90,
                "#168bd1",
                "#27c96f"
            );

        }

        else if (
            level === 2
        ) {

            drawPlanet(
                820,
                130,
                95,
                "#c74326",
                "#732515"
            );

        }

        else if (
            level === 3
        ) {

            drawPlanet(
                820,
                150,
                80,
                "#d9a441",
                "#8c5c1f"
            );


            ctx.strokeStyle =
                "#e8c875";

            ctx.lineWidth = 15;


            ctx.beginPath();

            ctx.ellipse(
                820,
                150,
                140,
                35,
                -0.15,
                0,
                Math.PI * 2
            );

            ctx.stroke();

        }

        else if (
            level === 4
        ) {

            drawPlanet(
                820,
                130,
                95,
                "#8d42d4",
                "#3c1474"
            );

        }

        else if (
            level === 5
        ) {

            drawPlanet(
                820,
                130,
                100,
                "#e34312",
                "#661000"
            );

        }

        else {

            drawPlanet(
                820,
                130,
                105,
                "#29233e",
                "#09070f"
            );

        }

    }


    // ==========================================
    // 行星
    // ==========================================

    function drawPlanet(
        x,
        y,
        radius,
        color1,
        color2
    ) {

        const gradient =
            ctx.createRadialGradient(
                x - 30,
                y - 30,
                10,
                x,
                y,
                radius
            );


        gradient.addColorStop(
            0,
            color1
        );


        gradient.addColorStop(
            1,
            color2
        );


        ctx.beginPath();


        ctx.arc(
            x,
            y,
            radius,
            0,
            Math.PI * 2
        );


        ctx.fillStyle =
            gradient;


        ctx.fill();

    }


    // ==========================================
    // 玩家
    // ==========================================

    function drawPlayer() {

        ctx.save();


        ctx.translate(
            player.x +
            player.width / 2,
            player.y +
            player.height / 2
        );


        if (
            player.direction === -1
        ) {

            ctx.scale(-1, 1);

        }


        ctx.beginPath();


        ctx.moveTo(22, 0);

        ctx.lineTo(-15, -16);

        ctx.lineTo(-8, 0);

        ctx.lineTo(-15, 16);


        ctx.closePath();


        ctx.fillStyle =
            "#42c8ff";


        ctx.fill();


        ctx.strokeStyle =
            "white";


        ctx.stroke();


        ctx.fillStyle =
            "#ffcc33";


        ctx.fillRect(
            -20,
            -5,
            10,
            10
        );


        ctx.restore();

    }


    // ==========================================
    // 敵人
    // ==========================================

    function drawEnemies() {

        for (
            const enemy of enemies
        ) {

            const setting =
                enemyTypeSettings[
                    enemy.type
                ];


            ctx.save();


            // ==================================
            // 被攻擊閃白
            // ==================================

            ctx.fillStyle =
                enemy.hitFlash > 0
                    ? "white"
                    : setting.color;


            // ==================================
            // 不同敵人外觀
            // ==================================

            if (
                enemy.type === "normal"
            ) {

                // 普通怪：正方形

                ctx.fillRect(
                    enemy.x,
                    enemy.y,
                    enemy.width,
                    enemy.height
                );

            }


            else if (
                enemy.type === "fast"
            ) {

                // 高速怪：三角形

                ctx.beginPath();

                ctx.moveTo(
                    enemy.x +
                    enemy.width,
                    enemy.y +
                    enemy.height / 2
                );

                ctx.lineTo(
                    enemy.x,
                    enemy.y
                );

                ctx.lineTo(
                    enemy.x,
                    enemy.y +
                    enemy.height
                );

                ctx.closePath();

                ctx.fill();

            }


            else if (
                enemy.type === "ranged"
            ) {

                // 遠程怪：圓形

                ctx.beginPath();

                ctx.arc(
                    enemy.x +
                    enemy.width / 2,
                    enemy.y +
                    enemy.height / 2,
                    enemy.width / 2,
                    0,
                    Math.PI * 2
                );

                ctx.fill();


                // 中心核心

                ctx.fillStyle =
                    "#ffffff";

                ctx.beginPath();

                ctx.arc(
                    enemy.x +
                    enemy.width / 2,
                    enemy.y +
                    enemy.height / 2,
                    6,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

            }


            else if (
                enemy.type === "tank"
            ) {

                // 坦克怪：厚重六角形

                const centerX =
                    enemy.x +
                    enemy.width / 2;

                const centerY =
                    enemy.y +
                    enemy.height / 2;

                const radius =
                    enemy.width / 2;


                ctx.beginPath();


                for (
                    let i = 0;
                    i < 6;
                    i++
                ) {

                    const angle =
                        (
                            Math.PI / 3
                        ) * i;


                    const x =
                        centerX +
                        Math.cos(angle) *
                        radius;


                    const y =
                        centerY +
                        Math.sin(angle) *
                        radius;


                    if (
                        i === 0
                    ) {

                        ctx.moveTo(
                            x,
                            y
                        );

                    }

                    else {

                        ctx.lineTo(
                            x,
                            y
                        );

                    }

                }


                ctx.closePath();

                ctx.fill();


                ctx.strokeStyle =
                    "#bfc5cc";

                ctx.lineWidth = 3;

                ctx.stroke();

            }


            ctx.restore();


            // ==================================
            // 血條
            // ==================================

            ctx.fillStyle =
                "#222";


            ctx.fillRect(
                enemy.x,
                enemy.y - 9,
                enemy.width,
                5
            );


            ctx.fillStyle =
                "#ff3333";


            ctx.fillRect(
                enemy.x,
                enemy.y - 9,
                enemy.width *
                Math.max(
                    0,
                    enemy.hp /
                    enemy.maxHp
                ),
                5
            );


            // ==================================
            // 坦克標誌
            // ==================================

            if (
                enemy.type === "tank"
            ) {

                ctx.fillStyle =
                    "white";

                ctx.font =
                    "12px Arial";

                ctx.fillText(
                    "TANK",
                    enemy.x,
                    enemy.y -
                    14
                );

            }

        }

    }


    // ==========================================
    // Boss
    // ==========================================

    function drawBoss() {

        if (
            boss === null
        )
            return;


        const hpPercent =
            boss.hp /
            boss.maxHp;


        // 暴走光環

        if (
            hpPercent <= 0.35
        ) {

            ctx.beginPath();

            ctx.arc(
                boss.x +
                boss.width / 2,
                boss.y +
                boss.height / 2,
                90,
                0,
                Math.PI * 2
            );

            ctx.strokeStyle =
                "rgba(255,0,80,0.5)";

            ctx.lineWidth = 8;

            ctx.stroke();

        }


        ctx.fillStyle =
            boss.hitFlash > 0
                ? "white"
                : hpPercent <= 0.35
                    ? "#ff1744"
                    : "#9b30ff";


        ctx.fillRect(
            boss.x,
            boss.y,
            boss.width,
            boss.height
        );


        // 核心

        ctx.beginPath();


        ctx.arc(
            boss.x +
            boss.width / 2,
            boss.y +
            boss.height / 2,
            30,
            0,
            Math.PI * 2
        );


        ctx.fillStyle =
            "#ff3355";


        ctx.fill();


        ctx.strokeStyle =
            "white";


        ctx.lineWidth = 4;

        ctx.stroke();


        // 血條

        ctx.fillStyle =
            "#222";


        ctx.fillRect(
            boss.x,
            boss.y - 20,
            boss.width,
            10
        );


        ctx.fillStyle =
            "#ff1744";


        ctx.fillRect(
            boss.x,
            boss.y - 20,
            boss.width *
            hpPercent,
            10
        );


        ctx.fillStyle =
            "white";


        ctx.font =
            "bold 18px Arial";


        ctx.fillText(
            "BOSS",
            boss.x + 45,
            boss.y - 30
        );


        // 階段

        ctx.font =
            "bold 14px Arial";


        if (
            bossPhase === 1
        ) {

            ctx.fillStyle =
                "#aaddff";

            ctx.fillText(
                "PHASE 1",
                boss.x + 42,
                boss.y +
                boss.height +
                22
            );

        }

        else if (
            bossPhase === 2
        ) {

            ctx.fillStyle =
                "#ffd633";

            ctx.fillText(
                "PHASE 2",
                boss.x + 42,
                boss.y +
                boss.height +
                22
            );

        }

        else {

            ctx.fillStyle =
                "#ff4444";

            ctx.fillText(
                "BERSERK!",
                boss.x + 30,
                boss.y +
                boss.height +
                22
            );

        }

    }


    // ==========================================
    // Boss 雷射
    // ==========================================

    function drawBossLaser() {

        if (
            !bossLaserActive ||
            boss === null
        )
            return;


        const startX =
            boss.x +
            boss.width / 2;


        const startY =
            boss.y +
            boss.height / 2;


        const endX =
            startX +
            Math.cos(
                bossLaserAngle
            ) *
            1200;


        const endY =
            startY +
            Math.sin(
                bossLaserAngle
            ) *
            1200;


        ctx.beginPath();


        ctx.moveTo(
            startX,
            startY
        );


        ctx.lineTo(
            endX,
            endY
        );


        ctx.strokeStyle =
            "rgba(255,0,255,0.35)";


        ctx.lineWidth = 25;

        ctx.stroke();


        ctx.beginPath();


        ctx.moveTo(
            startX,
            startY
        );


        ctx.lineTo(
            endX,
            endY
        );


        ctx.strokeStyle =
            "#ff55ff";


        ctx.lineWidth = 8;

        ctx.stroke();


        ctx.beginPath();


        ctx.moveTo(
            startX,
            startY
        );


        ctx.lineTo(
            endX,
            endY
        );


        ctx.strokeStyle =
            "white";


        ctx.lineWidth = 2;

        ctx.stroke();

    }


    // ==========================================
    // 玩家子彈
    // ==========================================

    function drawBullets() {

        for (
            const bullet of bullets
        ) {

            ctx.beginPath();


            ctx.arc(
                bullet.x,
                bullet.y,
                bullet.size,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                "#ffe600";


            ctx.shadowBlur =
                10;


            ctx.shadowColor =
                "#ffff00";


            ctx.fill();


            ctx.shadowBlur =
                0;

        }

    }


    // ==========================================
    // 敵人子彈
    // ==========================================

    function drawEnemyBullets() {

        for (
            const bullet of enemyBullets
        ) {

            ctx.beginPath();


            ctx.arc(
                bullet.x,
                bullet.y,
                bullet.size,
                0,
                Math.PI * 2
            );


            if (
                bullet.type ===
                "triple"
            ) {

                ctx.fillStyle =
                    "#ff66ff";

            }

            else if (
                bullet.type ===
                "enemy"
            ) {

                ctx.fillStyle =
                    "#b34dff";

            }

            else {

                ctx.fillStyle =
                    "#a52cff";

            }


            ctx.shadowBlur =
                15;


            ctx.shadowColor =
                "#d000ff";


            ctx.fill();


            ctx.shadowBlur =
                0;

        }

    }


    // ==========================================
    // 障礙物
    // ==========================================

    function drawObstacles() {

        for (
            const obstacle of obstacles
        ) {

            ctx.save();


            ctx.translate(
                obstacle.x,
                obstacle.y
            );


            ctx.rotate(
                obstacle.rotation
            );


            if (
                obstacle.type ===
                "meteor"
            ) {

                ctx.fillStyle =
                    "#777";


                ctx.beginPath();

                ctx.arc(
                    0,
                    0,
                    obstacle.size,
                    0,
                    Math.PI * 2
                );

                ctx.fill();


                ctx.strokeStyle =
                    "#aaa";

                ctx.stroke();

            }


            else if (
                obstacle.type ===
                "fireRock"
            ) {

                ctx.fillStyle =
                    "#ff4500";


                ctx.beginPath();

                ctx.moveTo(
                    0,
                    -obstacle.size
                );

                ctx.lineTo(
                    obstacle.size,
                    obstacle.size
                );

                ctx.lineTo(
                    -obstacle.size,
                    obstacle.size
                );

                ctx.closePath();

                ctx.fill();


                ctx.fillStyle =
                    "#ffd000";


                ctx.beginPath();

                ctx.arc(
                    0,
                    8,
                    obstacle.size / 3,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

            }


            else if (
                obstacle.type ===
                "ice"
            ) {

                ctx.fillStyle =
                    "#b8f3ff";


                ctx.beginPath();

                ctx.moveTo(
                    0,
                    -obstacle.size
                );

                ctx.lineTo(
                    obstacle.size / 2,
                    0
                );

                ctx.lineTo(
                    0,
                    obstacle.size
                );

                ctx.lineTo(
                    -obstacle.size / 2,
                    0
                );

                ctx.closePath();

                ctx.fill();

            }


            else if (
                obstacle.type ===
                "crystal"
            ) {

                ctx.fillStyle =
                    "#d85cff";


                ctx.beginPath();

                ctx.moveTo(
                    0,
                    -obstacle.size
                );

                ctx.lineTo(
                    obstacle.size,
                    0
                );

                ctx.lineTo(
                    0,
                    obstacle.size
                );

                ctx.lineTo(
                    -obstacle.size,
                    0
                );

                ctx.closePath();

                ctx.fill();


                ctx.strokeStyle =
                    "#ffb5ff";

                ctx.stroke();

            }


            else if (
                obstacle.type ===
                "lava"
            ) {

                ctx.fillStyle =
                    "#ff2600";


                ctx.beginPath();

                ctx.arc(
                    0,
                    0,
                    obstacle.size,
                    0,
                    Math.PI * 2
                );

                ctx.fill();


                ctx.fillStyle =
                    "#ffd000";


                ctx.beginPath();

                ctx.arc(
                    -5,
                    -5,
                    obstacle.size / 3,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

            }


            else if (
                obstacle.type ===
                "energy"
            ) {

                ctx.beginPath();

                ctx.arc(
                    0,
                    0,
                    obstacle.size,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle =
                    "#8b2cff";

                ctx.fill();


                ctx.strokeStyle =
                    "#e3aaff";

                ctx.lineWidth = 4;

                ctx.stroke();

            }


            ctx.restore();

        }

    }


    // ==========================================
    // 更新
    // ==========================================

    function update() {

        if (!gameRunning)
            return;


        updatePlayer();

        updateBullets();

        updateEnemyBullets();

        updateEnemies();

        updateBoss();

        updateObstacles();


        if (
            player.hp <= 0
        ) {

            player.hp = 0;

            updateUI();

            gameOver();

            return;

        }


        checkLevel();

        updateUI();

    }


    // ==========================================
    // 畫面
    // ==========================================

    function draw() {

        drawBackground();

        drawObstacles();

        drawEnemies();

        drawBoss();

        drawBossLaser();

        drawBullets();

        drawEnemyBullets();

        drawPlayer();

    }


    // ==========================================
    // 遊戲迴圈
    // ==========================================

    function gameLoop() {

        update();

        draw();

        requestAnimationFrame(
            gameLoop
        );

    }


    // ==========================================
    // 按鈕
    // ==========================================

    startButton.addEventListener(
        "click",
        function () {

            startGame();

        }
    );


    restartButton.addEventListener(
        "click",
        function () {

            startGame();

        }
    );


    homeButton.addEventListener(
        "click",
        function () {

            gameRunning = false;

            gameScreen.style.display =
                "none";

            resultScreen.style.display =
                "none";

            menuScreen.style.display =
                "flex";

        }
    );


    // ==========================================
    // 啟動
    // ==========================================

    gameLoop();

});