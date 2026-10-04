/**
 * EcoCash - Datos Iniciales y Semillas del Proyecto Escolar
 * Incluye catálogo de materiales de la Wiki, listados del Mercado, Guías DIY y Stickers
 */

const ECOLOGICAL_STICKERS = [
  { id: 'brote', emoji: '🌱', label: 'Brote Verde', meaning: 'Nueva Vida / Crece Verde', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'reciclaje', emoji: '♻️', label: '100% Reciclable', meaning: 'Ciclo Cerrado / Zero Waste', bg: 'bg-teal-50 text-teal-700 border-teal-200' },
  { id: 'tortuga', emoji: '🐢', label: 'Océano Limpio', meaning: 'Protegiendo Fauna Marina', bg: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { id: 'abeja', emoji: '🐝', label: 'Polinizador Eco', meaning: 'Biodiversidad Vital', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'planeta', emoji: '🌍', label: 'Tierra Viva', meaning: 'Nuestro Único Hogar', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'gota', emoji: '💧', label: 'Gota Pura', meaning: 'Cuidado y Ahorro de Agua', bg: 'bg-sky-50 text-sky-700 border-sky-200' },
  { id: 'girasol', emoji: '🌻', label: 'Energía Solar', meaning: 'Futuro Renovable', bg: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { id: 'bateria', emoji: '🔋', label: 'Cero Tóxicos', meaning: 'Pilas y Electrónicos Seguros', bg: 'bg-violet-50 text-violet-700 border-violet-200' },
  { id: 'bici', emoji: '🚲', label: 'Movilidad Verde', meaning: 'Cero Emisiones', bg: 'bg-green-50 text-green-700 border-green-200' },
  { id: 'arbol', emoji: '🌲', label: 'Pulmón Verde', meaning: 'Siembra y Respira', bg: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
  { id: 'corazon', emoji: '💚', label: 'Eco-Amor', meaning: 'Comunidad Consciente', bg: 'bg-lime-50 text-lime-800 border-lime-300' },
  { id: 'compost', emoji: '🍄', label: 'Compost Orgánico', meaning: 'Nutre la Tierra Viva', bg: 'bg-stone-50 text-stone-700 border-stone-200' }
];

const INITIAL_MATERIALS_WIKI = [
  {
    id: 'pet-1',
    code: 'PET 1',
    name: 'Plástico PET (Polietileno Tereftalato)',
    type: 'Plástico',
    recyclable: true,
    recyclabilityLevel: 'Excelente (Alta demanda)',
    icon: '🥤',
    examples: 'Botellas de agua, refrescos, envases de jugo, bandejas transparentes.',
    preparation: 'Vaciar líquidos, enjuagar con poca agua, aplastar para ahorrar espacio y tapar.',
    whereToTake: 'Centros de reciclaje, contenedores amarillos escolares y chatarreras.',
    estimatedValue: '$6.00 - $9.00 MXN / kg',
    diyIdea: 'Macetas autorriego para albahaca o menta, o ecoladrillos comprimidos.'
  },
  {
    id: 'pead-2',
    code: 'HDPE 2',
    name: 'Plástico PEAD (Polietileno Alta Densidad)',
    type: 'Plástico',
    recyclable: true,
    recyclabilityLevel: 'Muy Alta',
    icon: '🧴',
    examples: 'Botellas de champú, detergentes, garrafas de leche, cubetas.',
    preparation: 'Enjuagar para eliminar químicos residuales, retirar dosificadores con resorte.',
    whereToTake: 'Acopio municipal, recicladoras plásticas y programas escolares.',
    estimatedValue: '$8.00 - $12.00 MXN / kg',
    diyIdea: 'Corte transversal para palas de jardín o cajas organizadoras de herramientas.'
  },
  {
    id: 'aluminio',
    code: 'ALU',
    name: 'Aluminio (Latas y Perfiles)',
    type: 'Metal',
    recyclable: true,
    recyclabilityLevel: 'Infinita (100% Reciclable)',
    icon: '🥫',
    examples: 'Latas de refresco/cerveza, papel aluminio limpio, marcos de ventanas.',
    preparation: 'Escurrir totalmente, aplastar pisándola o con compactador casero.',
    whereToTake: 'Chatarreras locales, centros de pesaje de metales.',
    estimatedValue: '$24.00 - $32.00 MXN / kg',
    diyIdea: 'Ceniceros o portalápices artesanales repujados con diseño escolar.'
  },
  {
    id: 'cobre',
    code: 'CU',
    name: 'Cobre de Primera y Segunda',
    type: 'Metal',
    recyclable: true,
    recyclabilityLevel: 'Máximo Valor Comercial',
    icon: '⚡',
    examples: 'Cables eléctricos pelados, tuberías de fontanería, bobinas de motores.',
    preparation: 'Separar el forro de PVC (plástico) del hilo de cobre brillante.',
    whereToTake: 'Puntos de acopio de metales no ferrosos certificados.',
    estimatedValue: '$130.00 - $160.00 MXN / kg',
    diyIdea: 'Joyería artesanal con alambre de cobre pulido o esculturas de alambre.'
  },
  {
    id: 'carton-corrugado',
    code: 'PAP 20',
    name: 'Cartón Corrugado y Cajas',
    type: 'Papel y Cartón',
    recyclable: true,
    recyclabilityLevel: 'Muy Alta (si está seco)',
    icon: '📦',
    examples: 'Cajas de envíos, empaques de electrodomésticos, cajas de zapatos.',
    preparation: 'Desarmar y aplanar cajas, retirar cintas adhesivas gruesas. NO mojar ni engrasar.',
    whereToTake: 'Puntos de acopio de papel y cartón, camiones recolectores.',
    estimatedValue: '$2.00 - $3.50 MXN / kg',
    diyIdea: 'Rascadores para gatos, organizadores de gavetas escolares o casas de muñecas.'
  },
  {
    id: 'vidrio',
    code: 'GL 70',
    name: 'Vidrio (Botellas y Frascos)',
    type: 'Vidrio',
    recyclable: true,
    recyclabilityLevel: 'Infinita (Sin perder calidad)',
    icon: '🍶',
    examples: 'Botellas de vino, cerveza, frascos de mermelada, conservas.',
    preparation: 'Lavar restos de comida, retirar tapas metálicas (las tapas van en metal).',
    whereToTake: 'Contenedor verde municipal, depósitos de botellas retornables.',
    estimatedValue: '$0.80 - $1.50 MXN / kg',
    diyIdea: 'Lámparas con tiras LED para el dormitorio o portavelas aromáticos decorativos.'
  },
  {
    id: 'baterias-pilas',
    code: 'ESP',
    name: 'Pilas y Baterías Alcalinas',
    type: 'Residuo Especial',
    recyclable: false,
    recyclabilityLevel: 'Punto Limpio Obligatorio (Peligroso)',
    icon: '🔋',
    examples: 'Pilas AA, AAA, 9V, baterías de litio de celulares y laptops.',
    preparation: 'Cubrir los polos con cinta aislante transparente para evitar cortocircuitos.',
    whereToTake: 'Contenedores de acopio escolar "Ponte las Pilas", estaciones de metro o supermercados.',
    estimatedValue: 'Sin valor de venta (Evita contaminación de mantos acuíferos).',
    diyIdea: '¡NO REUTILIZAR NI ABRIR! Depositar de inmediato en el contenedor especial.'
  },
  {
    id: 'aceite-cocina',
    code: 'ORG',
    name: 'Aceite Usado de Cocina',
    type: 'Residuo Especial',
    recyclable: true,
    recyclabilityLevel: 'Transformable en Biodiésel',
    icon: '🍳',
    examples: 'Aceite vegetal usado para freír papas, milanesas o empanadas.',
    preparation: 'Dejar enfriar, colar con un trapo para retirar residuos de comida y embotellar en PET.',
    whereToTake: 'Centros de recolección de aceite vegetal para biodiésel o jabón.',
    estimatedValue: '$4.00 - $7.00 MXN / litro',
    diyIdea: 'Fabricación de jabón ecológico casero para lavar ropa (con supervisión de química).'
  }
];

const INITIAL_MARKET_POSTS = [
  {
    id: 'post-1',
    title: 'Lote de 30 kg de Botellas PET Limpias y Aplastadas',
    category: 'Plásticos',
    type: 'Venta', // 'Venta' | 'Donacion' | 'PuntoAcopio'
    price: '$210 MXN',
    priceNumeric: 210,
    unit: 'Lote completo',
    location: 'Campus Escolar Norte (Lab de Ciencias)',
    description: 'Recolectadas durante la campaña del mes del medio ambiente. Están perfectamente lavadas, secas y compactadas.',
    authorUid: 'user_sofia_3b',
    authorName: 'Sofía Martínez (3ro B)',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sofia',
    date: 'Hace 2 horas',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
    contact: 'WhatsApp: 55-4321-9876',
    commentsCount: 3
  },
  {
    id: 'post-2',
    title: 'Cobre Pelado Brillante de Instalación Eléctrica (6 kg)',
    category: 'Metales / Chatarra',
    type: 'Venta',
    price: '$900 MXN',
    priceNumeric: 900,
    unit: '6 Kilogramos',
    location: 'Taller de Electricidad / Entrada Sur',
    description: 'Sobrantes de renovación del taller técnico escolar. Calidad de primera, sin forro de plástico, listo para pesaje.',
    authorUid: 'user_mateo_taller',
    authorName: 'Mateo Gómez (Taller Técnico)',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Mateo',
    date: 'Hace 5 horas',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    contact: 'mateo.taller@escuela.edu',
    commentsCount: 2
  },
  {
    id: 'post-3',
    title: 'Donación: 35 Cajas de Cartón Limpias para Proyectos o Mudanzas',
    category: 'Papel y Cartón',
    type: 'Donacion',
    price: '¡GRATIS!',
    priceNumeric: 0,
    unit: '35 Cajas variadas',
    location: 'Biblioteca Escolar (Pasillo B)',
    description: 'Cajas de libros y material de papelería en excelente estado. Ideales para proyectos de robótica, arte o embalaje.',
    authorUid: 'user_profe_carlos',
    authorName: 'Prof. Carlos Rivera',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Carlos',
    date: 'Ayer',
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    contact: 'carlos.rivera@escuela.edu',
    commentsCount: 1
  },
  {
    id: 'post-4',
    title: 'Punto de Acopio Permanente: Pilas y Celulares en Desuso',
    category: 'Electrónicos',
    type: 'PuntoAcopio',
    price: 'Recepción Libre',
    priceNumeric: 0,
    unit: 'Cualquier cantidad',
    location: 'Entrada del Auditorio Principal',
    description: 'Contenedor certificado para evitar que metales pesados como mercurio y cadmio contaminen el suelo y mantos freáticos.',
    authorUid: 'user_comite_eco',
    authorName: 'Comité Ecológico EcoCash',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=EcoComite',
    date: 'Activo',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80',
    contact: 'ecocash@escuela.edu',
    commentsCount: 4
  }
];

const INITIAL_DIY_PROJECTS = [
  {
    id: 'diy-1',
    title: 'Maceta Autorriego con Botella PET',
    material: 'Plástico (Botellas PET)',
    difficulty: 'Fácil',
    time: '15 minutos',
    authorUid: 'user_sofia_3b',
    authorName: 'Sofía Martínez (3ro B)',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sofia',
    likes: 24,
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
    materialsNeeded: ['1 botella PET de 2 litros', '1 cuerda gruesa de algodón', 'Tierra y semilla/planta', 'Tijeras'],
    steps: [
      'Corta la botella plástica por la mitad con tijeras.',
      'Perfora la taparrosca con un clavo o tijera caliente y pasa la cuerda de algodón dejando 8 cm adentro y 8 cm afuera.',
      'Coloca la parte superior invertida (como embudo) dentro de la base de la botella.',
      'Llena la base inferior con agua y la parte superior con tierra y tu planta. La cuerda absorberá el agua automáticamente.'
    ]
  },
  {
    id: 'diy-2',
    title: 'Organizador de Escritorio con Latas de Conserva',
    material: 'Metales (Latas de atún y verduras)',
    difficulty: 'Fácil',
    time: '30 minutos',
    authorUid: 'user_mateo_taller',
    authorName: 'Mateo Gómez (Taller)',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Mateo',
    likes: 19,
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    materialsNeeded: ['4-6 latas de diferentes tamaños', 'Pintura acrílica o sobrantes de esmalte', 'Pegamento silicón o tornillos pequeños', 'Lija'],
    steps: [
      'Lava bien las latas y lija suavemente los bordes superiores para evitar cortes.',
      'Pinta cada lata con tus colores favoritos o decóralas con papel reciclado.',
      'Únelas en forma de pirámide o torre utilizando silicón resistente.',
      '¡Listo! Tendrás compartimentos para lápices, tijeras, reglas y clips sin gastar dinero.'
    ]
  },
  {
    id: 'diy-3',
    title: 'Compostera Casera en Cubeta con Residuos de Fruta',
    material: 'Orgánicos y Cubeta de Pintura',
    difficulty: 'Intermedio',
    time: '45 minutos',
    authorUid: 'user_profe_carlos',
    authorName: 'Prof. Carlos Rivera',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Carlos',
    likes: 38,
    image: 'https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=600&q=80',
    materialsNeeded: ['1 cubeta plástica usada con tapa', 'Taladro o clavo caliente para orificios', 'Tierra negra y hojas secas', 'Cáscaras de verdura y fruta'],
    steps: [
      'Haz pequeños orificios en el fondo y en los laterales de la cubeta para ventilación y drenaje.',
      'Coloca una primera capa de 5 cm de hojas secas o cartón triturado (materia marrón rica en carbono).',
      'Agrega tus restos de cáscaras de plátano, manzana y café (materia verde rica en nitrógeno). Evita carnes y lácteos.',
      'Cubre siempre los restos frescos con otra capa de hojas secas para evitar mosquitas y malos olores. Riega ligeramente cada 5 días.'
    ]
  },
  {
    id: 'diy-4',
    title: 'Lámpara de Noche con Frasco de Café y Luces LED',
    material: 'Vidrio (Frascos con tapa)',
    difficulty: 'Fácil',
    time: '20 minutos',
    authorUid: 'user_sofia_3b',
    authorName: 'Sofía Martínez (3ro B)',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sofia',
    likes: 31,
    image: 'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?auto=format&fit=crop&w=600&q=80',
    materialsNeeded: ['Frasco de vidrio grande limpio', 'Tira de luces LED de hadas a pilas', 'Piedritas de río o arena de playa', 'Cuerda de yute'],
    steps: [
      'Retira la etiqueta del frasco con agua caliente y un poco de aceite para quitar el pegamento.',
      'Coloca 3 cm de piedritas en el fondo como base estética.',
      'Introduce la tira LED enrollada suavemente.',
      'Pega el compartimento de baterías en la parte inferior de la tapa metálica con cinta doble cara y cierra el frasco.'
    ]
  }
];

const INITIAL_COMMENTS = [
  {
    id: 'comm-1',
    postId: 'post-1',
    authorUid: 'user_mateo_taller',
    authorName: 'Mateo Gómez',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Mateo',
    text: '¡Excelente iniciativa Sofía! ¿Se pueden pasar a recoger mañana durante el receso en el laboratorio?',
    stickerId: 'reciclaje',
    aiVerified: true,
    aiTag: 'Comentario Constructivo',
    timestamp: 'Hace 1 hora'
  },
  {
    id: 'comm-2',
    postId: 'post-1',
    authorUid: 'user_sofia_3b',
    authorName: 'Sofía Martínez (3ro B)',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sofia',
    text: '¡Claro que sí Mateo! Estaremos ahí desde las 10:30 am con la báscula escolar lista.',
    stickerId: 'brote',
    aiVerified: true,
    aiTag: 'Respuesta Positiva',
    timestamp: 'Hace 45 minutos'
  },
  {
    id: 'comm-3',
    postId: 'post-4',
    authorUid: 'user_profe_carlos',
    authorName: 'Prof. Carlos Rivera',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Carlos',
    text: 'Recordemos a todos los estudiantes pegar cinta en los polos de las pilas antes de depositarlas para máxima seguridad.',
    stickerId: 'bateria',
    aiVerified: true,
    aiTag: 'Seguridad Escolar Verificada',
    timestamp: 'Hace 3 horas'
  }
];
