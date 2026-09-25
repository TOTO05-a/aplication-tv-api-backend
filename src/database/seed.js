"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const env_1 = require("../config/env");
const connection_1 = require("./connection");
const collections_1 = require("./collections");
const producers = [
    { key: "toei", name: "Toei Animation", description: "Estudio de animacion japones fundado en 1948", website: "https://www.toei-anim.co.jp" },
    { key: "ufotable", name: "Ufotable", description: "Estudio de animacion japones conocido por su calidad visual", website: "https://ufotable.com" },
    { key: "tms", name: "TMS Entertainment", description: "Estudio de animacion japones fundado en 1946", website: "https://www.tms-e.com" },
    { key: "mappa", name: "MAPPA", description: "Estudio de animacion japones fundado en 2011", website: "https://www.mappa.co.jp" },
    { key: "cartoonnetwork", name: "Cartoon Network Studios", description: "Estudio de animacion de Warner Bros Discovery", website: "https://www.cartoonnetwork.com" },
    { key: "wbanimation", name: "Warner Bros. Animation", description: "Division de animacion de Warner Bros", website: "https://www.warnerbros.com" },
    { key: "adultswim", name: "Williams Street", description: "Estudio productor de Adult Swim", website: "https://www.adultswim.com" },
    { key: "disney", name: "Disney Television Animation", description: "Division de animacion televisiva de Disney", website: "https://www.disney.com" },
    { key: "nbcuniversal", name: "NBCUniversal Television", description: "Productora de television de NBCUniversal", website: "https://www.nbcuniversal.com" },
    { key: "bbc", name: "BBC Studios", description: "Productora britanica de television", website: "https://www.bbcstudios.com" }
];
const actors = [
    { key: "masako", name: "Masako Nozawa", biography: "Actriz de voz japonesa reconocida por interpretar a Goku" },
    { key: "natsuki", name: "Natsuki Hanae", biography: "Actor de voz japones" },
    { key: "hiromi", name: "Hiromi Tsuru", biography: "Actriz de voz japonesa" },
    { key: "junya", name: "Junya Enoki", biography: "Actor de voz japones" },
    { key: "kikuko", name: "Kikuko Inoue", biography: "Actriz de voz japonesa" },
    { key: "voiceEN1", name: "Dan Castellaneta", biography: "Actor de voz estadounidense" },
    { key: "voiceEN2", name: "Justin Roiland", biography: "Actor de voz y creador estadounidense" },
    { key: "voiceEN3", name: "Kristen Schaal", biography: "Actriz de voz y comediante estadounidense" },
    { key: "steveCarell", name: "Steve Carell", biography: "Actor estadounidense" },
    { key: "johnKrasinski", name: "John Krasinski", biography: "Actor estadounidense" },
    { key: "cillianMurphy", name: "Cillian Murphy", biography: "Actor irlandes" },
    { key: "tomHardy", name: "Tom Hardy", biography: "Actor britanico" },
    { key: "collinChou", name: "Yuki Kaji", biography: "Actor de voz japones" },
    { key: "aoiYuki", name: "Aoi Yuuki", biography: "Actriz de voz japonesa" }
];
const programs = [
    {
        title: "Dragon Ball",
        synopsis: "Las aventuras de Goku desde su infancia mientras entrena artes marciales y busca las esferas del dragon.",
        poster: "https://upload.wikimedia.org/wikipedia/en/1/16/Dragon_Ball_Z_Kai_logo.png",
        trailer: "https://www.youtube.com/watch?v=jsu9F_lIvZk",
        status: "finished",
        category: "Anime",
        producer: "toei",
        episodes: [
            { number: 1, title: "El misterio de las esferas del dragon", synopsis: "Goku conoce a Bulma y comienza la busqueda de las esferas del dragon", duration: 24, releaseDate: "1986-02-26" },
            { number: 2, title: "Una carrera de locos", synopsis: "Goku y Bulma emprenden su primer viaje juntos", duration: 24, releaseDate: "1986-03-05" }
        ],
        characters: [
            { name: "Son Goku", description: "Guerrero saiyajin protagonista de la serie", actor: "masako" },
            { name: "Bulma", description: "Cientifica e inventora, amiga de Goku", actor: "kikuko" }
        ]
    },
    {
        title: "Demon Slayer",
        synopsis: "Tanjiro se convierte en cazador de demonios para salvar a su hermana convertida en demonio y vengar a su familia.",
        poster: "https://upload.wikimedia.org/wikipedia/en/0/9f/Kimetsu_no_Yaiba_volume_1_cover.jpg",
        trailer: "https://www.youtube.com/watch?v=VQGCKyvzIM4",
        status: "ongoing",
        category: "Anime",
        producer: "ufotable",
        episodes: [
            { number: 1, title: "Crueldad", synopsis: "Tanjiro encuentra a su familia atacada por un demonio", duration: 24, releaseDate: "2019-04-06" },
            { number: 2, title: "Colmillos cruzados", synopsis: "Tanjiro busca la forma de curar a su hermana", duration: 24, releaseDate: "2019-04-13" }
        ],
        characters: [
            { name: "Tanjiro Kamado", description: "Joven cazador de demonios protagonista", actor: "natsuki" },
            { name: "Nezuko Kamado", description: "Hermana de Tanjiro convertida en demonio", actor: "aoiYuki" }
        ]
    },
    {
        title: "Captain Tsubasa",
        synopsis: "Tsubasa Oozora persigue su sueno de convertirse en una estrella mundial del futbol.",
        poster: "https://upload.wikimedia.org/wikipedia/en/8/85/Captain_Tsubasa_Vol_1.jpg",
        trailer: "https://www.youtube.com/watch?v=1s6vsvxlWo0",
        status: "finished",
        category: "Anime",
        producer: "tms",
        episodes: [
            { number: 1, title: "El nino del balon", synopsis: "Tsubasa llega a un nuevo pueblo con su balon de futbol", duration: 24, releaseDate: "1983-10-08" }
        ],
        characters: [
            { name: "Tsubasa Oozora", description: "Delantero prodigio protagonista de la serie", actor: "junya" }
        ]
    },
    {
        title: "Jujutsu Kaisen",
        synopsis: "Yuji Itadori se involucra en el mundo de la hechiceria despues de tragar un dedo maldito.",
        poster: "https://upload.wikimedia.org/wikipedia/en/6/68/Jujutsu_Kaisen_chapter_1_cover.jpg",
        trailer: "https://www.youtube.com/watch?v=4A_X0Wt2edw",
        status: "ongoing",
        category: "Anime",
        producer: "mappa",
        episodes: [
            { number: 1, title: "Ryomen Sukuna", synopsis: "Yuji descubre la existencia de las maldiciones", duration: 24, releaseDate: "2020-10-03" }
        ],
        characters: [
            { name: "Yuji Itadori", description: "Estudiante que se convierte en el recipiente de Sukuna", actor: "junya" },
            { name: "Megumi Fushiguro", description: "Hechicero jujutsu compañero de Yuji", actor: "collinChou" }
        ]
    },
    {
        title: "Chainsaw Man",
        synopsis: "Denji fusiona su destino con el demonio motosierra Pochita para convertirse en cazador de demonios.",
        poster: "https://upload.wikimedia.org/wikipedia/en/a/a6/Chainsaw_Man_vol_1_cover.jpg",
        trailer: "https://www.youtube.com/watch?v=q15SjxfOfkw",
        status: "ongoing",
        category: "Anime",
        producer: "mappa",
        episodes: [
            { number: 1, title: "Perro y motosierra", synopsis: "Denji se convierte en Chainsaw Man", duration: 24, releaseDate: "2022-10-11" }
        ],
        characters: [
            { name: "Denji", description: "Joven que se fusiona con el demonio motosierra", actor: "natsuki" }
        ]
    },
    {
        title: "El Increible Mundo de Gumball",
        synopsis: "Gumball Watterson y su familia viven aventuras disparatadas en la ciudad de Elmore.",
        poster: "https://upload.wikimedia.org/wikipedia/en/2/20/The_Amazing_World_of_Gumball_titlecard.png",
        trailer: "https://www.youtube.com/watch?v=xQI4pnkVoAA",
        status: "finished",
        category: "Cartoons",
        producer: "cartoonnetwork",
        episodes: [
            { number: 1, title: "El DVD", synopsis: "Gumball busca recuperar un DVD de la familia", duration: 11, releaseDate: "2011-05-03" }
        ],
        characters: [
            { name: "Gumball Watterson", description: "Gato azul protagonista de la serie", actor: "voiceEN2" }
        ]
    },
    {
        title: "Bugs Bunny",
        synopsis: "El astuto conejo Bugs Bunny se enfrenta a sus rivales con humor e ingenio en cortos clasicos.",
        poster: "https://upload.wikimedia.org/wikipedia/en/2/26/Bugs_Bunny.svg",
        trailer: "https://www.youtube.com/watch?v=Kzs3iF33dtQ",
        status: "finished",
        category: "Cartoons",
        producer: "wbanimation",
        episodes: [
            { number: 1, title: "Un conejo confundido", synopsis: "Bugs se topa con Elmer Gruñon en el bosque", duration: 7, releaseDate: "1940-07-27" }
        ],
        characters: [
            { name: "Bugs Bunny", description: "Conejo astuto protagonista de los cortos", actor: "voiceEN1" }
        ]
    },
    {
        title: "Un Show Mas",
        synopsis: "Mordecai y Rigby, empleados de un parque, viven situaciones absurdas que escalan a lo extraordinario.",
        poster: "https://upload.wikimedia.org/wikipedia/en/2/2e/RegularShowTitleCard.png",
        trailer: "https://www.youtube.com/watch?v=cJnyaFUM55s",
        status: "finished",
        category: "Cartoons",
        producer: "cartoonnetwork",
        episodes: [
            { number: 1, title: "Los primeros episodios", synopsis: "Mordecai y Rigby evitan su trabajo y terminan en problemas", duration: 11, releaseDate: "2010-09-06" }
        ],
        characters: [
            { name: "Mordecai", description: "Arrendajo azul protagonista", actor: "voiceEN2" }
        ]
    },
    {
        title: "Hora de Aventura",
        synopsis: "Finn el humano y Jake el perro exploran la Tierra de Ooo viviendo aventuras magicas.",
        poster: "https://upload.wikimedia.org/wikipedia/en/1/1e/Adventure_Time_final_title_card.png",
        trailer: "https://www.youtube.com/watch?v=b2Ln2sgTfUs",
        status: "finished",
        category: "Cartoons",
        producer: "cartoonnetwork",
        episodes: [
            { number: 1, title: "El punto de partida", synopsis: "Finn y Jake enfrentan a la princesa Slime", duration: 11, releaseDate: "2010-04-05" }
        ],
        characters: [
            { name: "Finn", description: "Ultimo humano conocido en la Tierra de Ooo", actor: "voiceEN2" },
            { name: "Jake", description: "Perro magico compañero de Finn", actor: "voiceEN1" }
        ]
    },
    {
        title: "Pantera Rosa",
        synopsis: "La Pantera Rosa protagoniza cortos de comedia muda llenos de situaciones ingeniosas.",
        poster: "https://upload.wikimedia.org/wikipedia/en/9/97/Pink_Panther_1964.jpg",
        trailer: "https://www.youtube.com/watch?v=UkK8sYnHapM",
        status: "finished",
        category: "Cartoons",
        producer: "wbanimation",
        episodes: [
            { number: 1, title: "El fenomeno de la pantera rosa", synopsis: "Primer corto animado de la pantera rosa", duration: 6, releaseDate: "1964-12-18" }
        ],
        characters: [
            { name: "Pantera Rosa", description: "Felino rosado protagonista sin dialogo", actor: "voiceEN1" }
        ]
    },
    {
        title: "Rick y Morty",
        synopsis: "El cientifico Rick Sanchez arrastra a su nieto Morty a viajes interdimensionales caoticos.",
        poster: "https://upload.wikimedia.org/wikipedia/en/f/f0/Rick_and_Morty.svg",
        trailer: "https://www.youtube.com/watch?v=1TeM_GtSXvI",
        status: "ongoing",
        category: "Series",
        producer: "adultswim",
        episodes: [
            { number: 1, title: "Piloto", synopsis: "Rick lleva a Morty a su primera aventura interdimensional", duration: 22, releaseDate: "2013-12-02" }
        ],
        characters: [
            { name: "Rick Sanchez", description: "Cientifico genial y ciniso", actor: "voiceEN2" },
            { name: "Morty Smith", description: "Nieto de Rick, arrastrado a sus aventuras", actor: "voiceEN2" }
        ]
    },
    {
        title: "Gravity Falls",
        synopsis: "Dipper y Mabel Pines pasan el verano con su tio en un pueblo lleno de misterios paranormales.",
        poster: "https://upload.wikimedia.org/wikipedia/en/1/1e/Gravity_Falls_title_card.png",
        trailer: "https://www.youtube.com/watch?v=8v0DGku0Yjc",
        status: "finished",
        category: "Series",
        producer: "disney",
        episodes: [
            { number: 1, title: "Tourist Trapped", synopsis: "Dipper y Mabel descubren un diario misterioso", duration: 22, releaseDate: "2012-06-15" }
        ],
        characters: [
            { name: "Dipper Pines", description: "Adolescente curioso que investiga los misterios del pueblo", actor: "voiceEN3" },
            { name: "Mabel Pines", description: "Hermana gemela optimista de Dipper", actor: "voiceEN3" }
        ]
    },
    {
        title: "Star vs las Fuerzas del Mal",
        synopsis: "La princesa Star Butterfly llega a la Tierra con una varita magica y vive junto a Marco Diaz.",
        poster: "https://upload.wikimedia.org/wikipedia/en/9/94/Star_vs_the_Forces_of_Evil_logo.png",
        trailer: "https://www.youtube.com/watch?v=CZhLwVW7rHs",
        status: "finished",
        category: "Series",
        producer: "disney",
        episodes: [
            { number: 1, title: "Star viene a la Tierra", synopsis: "Star llega a vivir con la familia Diaz", duration: 22, releaseDate: "2015-01-18" }
        ],
        characters: [
            { name: "Star Butterfly", description: "Princesa de otra dimension con poderes magicos", actor: "voiceEN3" },
            { name: "Marco Diaz", description: "Companero de intercambio de Star", actor: "voiceEN2" }
        ]
    },
    {
        title: "The Office",
        synopsis: "Falso documental sobre la vida cotidiana de los empleados de una empresa de papel en Scranton.",
        poster: "https://upload.wikimedia.org/wikipedia/en/0/0a/The_Office_UK_S1_logo.png",
        trailer: "https://www.youtube.com/watch?v=LHOtME2DL4g",
        status: "finished",
        category: "Series",
        producer: "nbcuniversal",
        episodes: [
            { number: 1, title: "Piloto", synopsis: "Se presenta a los empleados de la oficina de Scranton", duration: 22, releaseDate: "2005-03-24" }
        ],
        characters: [
            { name: "Michael Scott", description: "Gerente regional de la sucursal de Scranton", actor: "steveCarell" },
            { name: "Jim Halpert", description: "Vendedor y bromista de la oficina", actor: "johnKrasinski" }
        ]
    },
    {
        title: "Peaky Blinders",
        synopsis: "La familia Shelby lidera una banda criminal en la Birmingham de la posguerra.",
        poster: "https://upload.wikimedia.org/wikipedia/en/9/93/Peaky_Blinders_titlecard.jpg",
        trailer: "https://www.youtube.com/watch?v=e8FL_Sl9DhQ",
        status: "finished",
        category: "Series",
        producer: "bbc",
        episodes: [
            { number: 1, title: "Episodio 1", synopsis: "Se presenta a Thomas Shelby y la familia Peaky Blinders", duration: 58, releaseDate: "2013-09-12" }
        ],
        characters: [
            { name: "Thomas Shelby", description: "Lider de la familia Shelby", actor: "cillianMurphy" },
            { name: "Alfie Solomons", description: "Rival y aliado ocasional de Thomas", actor: "tomHardy" }
        ]
    }
];
async function seed() {
    const db = await (0, connection_1.connectDatabase)();
    await (0, collections_1.ensureIndexes)();
    console.log("Limpiando colecciones existentes");
    await Promise.all([
        collections_1.collections.users().deleteMany({}),
        collections_1.collections.categories().deleteMany({}),
        collections_1.collections.programs().deleteMany({}),
        collections_1.collections.episodes().deleteMany({}),
        collections_1.collections.actors().deleteMany({}),
        collections_1.collections.characters().deleteMany({}),
        collections_1.collections.producers().deleteMany({}),
        collections_1.collections.favorites().deleteMany({}),
        collections_1.collections.ratings().deleteMany({}),
        collections_1.collections.comments().deleteMany({})
    ]);
    console.log("Creando administrador inicial");
    const hashedPassword = await bcrypt_1.default.hash(env_1.env.adminPassword, 10);
    await collections_1.collections.users().insertOne({
        name: env_1.env.adminName,
        email: env_1.env.adminEmail,
        password: hashedPassword,
        role: "admin",
        createdAt: new Date()
    });
    console.log("Creando usuario de prueba");
    const demoUserPassword = await bcrypt_1.default.hash("Usuario1234", 10);
    await collections_1.collections.users().insertOne({
        name: "Usuario Demo",
        email: "usuario@campuslands.edu.co",
        password: demoUserPassword,
        role: "user",
        createdAt: new Date()
    });
    console.log("Creando categorias");
    const categoryNames = ["Anime", "Cartoons", "Series"];
    const categoryDescriptions = {
        Anime: "Animacion japonesa de todos los generos",
        Cartoons: "Caricaturas clasicas y modernas para toda la familia",
        Series: "Series de television live action y animadas para adultos"
    };
    const categoryIds = {};
    for (const name of categoryNames) {
        const result = await collections_1.collections.categories().insertOne({
            name,
            description: categoryDescriptions[name],
            createdAt: new Date()
        });
        categoryIds[name] = result.insertedId;
    }
    console.log("Creando productoras");
    const producerIds = {};
    for (const producer of producers) {
        const result = await collections_1.collections.producers().insertOne({
            name: producer.name,
            description: producer.description,
            website: producer.website
        });
        producerIds[producer.key] = result.insertedId;
    }
    console.log("Creando actores");
    const actorIds = {};
    for (const actor of actors) {
        const result = await collections_1.collections.actors().insertOne({
            name: actor.name,
            biography: actor.biography
        });
        actorIds[actor.key] = result.insertedId;
    }
    console.log("Creando programas, episodios y personajes");
    for (const program of programs) {
        const now = new Date();
        const programResult = await collections_1.collections.programs().insertOne({
            title: program.title,
            synopsis: program.synopsis,
            poster: program.poster,
            trailer: program.trailer,
            status: program.status,
            categoryId: categoryIds[program.category],
            producerId: producerIds[program.producer],
            createdAt: now,
            updatedAt: now
        });
        for (const episode of program.episodes) {
            await collections_1.collections.episodes().insertOne({
                programId: programResult.insertedId,
                number: episode.number,
                title: episode.title,
                synopsis: episode.synopsis,
                duration: episode.duration,
                releaseDate: new Date(episode.releaseDate)
            });
        }
        for (const character of program.characters) {
            await collections_1.collections.characters().insertOne({
                name: character.name,
                description: character.description,
                programId: programResult.insertedId,
                actorId: actorIds[character.actor]
            });
        }
    }
    console.log("Seed completado correctamente");
    console.log(`Programas creados: ${programs.length}`);
    console.log(`Admin: ${env_1.env.adminEmail}`);
    await (0, connection_1.closeDatabase)();
}
seed().catch((error) => {
    console.error("Error ejecutando el seed", error);
    process.exit(1);
});
