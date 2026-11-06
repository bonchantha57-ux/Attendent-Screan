/**
 * Comprehensive Geographic Registry of Cambodia
 * Includes all 25 Provinces, Cities, Districts (Srok/Khan), Universities, Malls, Hospitals, Pagodas, Landmarks.
 * Enables instant local search in both Khmer and English.
 */

export const CAMBODIA_LOCATIONS = [
  // --- 25 PROVINCES & CAPITALS ---
  {
    nameKm: 'ខេត្តកំពង់ស្ពឺ (សាលាខេត្ត និងក្រុងច្បារមន)',
    nameEn: 'Kampong Speu Province (Chbar Mon City Center)',
    category: 'province',
    categoryKm: '🏛️ ខេត្ត',
    lat: 11.4552,
    lng: 104.5208,
    keywords: ['កំពង់ស្ពឺ', 'កំពុងស្ពឺ', 'kampong speu', 'chbar mon', 'ច្បារមន', 'ខេត្តកំពង់ស្ពឺ'],
    zoom: 13,
  },
  {
    nameKm: 'រាជធានីភ្នំពេញ (Phnom Penh Capital)',
    nameEn: 'Phnom Penh Capital Center',
    category: 'province',
    categoryKm: '🏛️ រាជធានី',
    lat: 11.5564,
    lng: 104.9282,
    keywords: ['ភ្នំពេញ', 'phnom penh', 'capital', 'រាជធានី'],
    zoom: 13,
  },
  {
    nameKm: 'ខេត្តសៀមរាប (ក្រុងសៀមរាប)',
    nameEn: 'Siem Reap Province (City Center)',
    category: 'province',
    categoryKm: '🏛️ ខេត្ត',
    lat: 13.3633,
    lng: 103.8564,
    keywords: ['សៀមរាប', 'siem reap', 'អង្គរ', 'angkor', 'ខេត្តសៀមរាប'],
    zoom: 13,
  },
  {
    nameKm: 'ខេត្តបាត់ដំបង (ក្រុងបាត់ដំបង)',
    nameEn: 'Battambang Province (City Center)',
    category: 'province',
    categoryKm: '🏛️ ខេត្ត',
    lat: 13.0957,
    lng: 103.2022,
    keywords: ['បាត់ដំបង', 'battambang', 'ខេត្តបាត់ដំបង'],
    zoom: 13,
  },
  {
    nameKm: 'ខេត្តកំពត (ក្រុងកំពត)',
    nameEn: 'Kampot Province (City Center)',
    category: 'province',
    categoryKm: '🏛️ ខេត្ត',
    lat: 10.6104,
    lng: 104.1818,
    keywords: ['កំពត', 'kampot', 'ខេត្តកំពត'],
    zoom: 13,
  },
  {
    nameKm: 'ខេត្តព្រះសីហនុ (ក្រុងព្រះសីហនុ / កំពង់សោម)',
    nameEn: 'Preah Sihanouk Province (Sihanoukville)',
    category: 'province',
    categoryKm: '🏛️ ខេត្ត',
    lat: 10.6275,
    lng: 103.5221,
    keywords: ['ព្រះសីហនុ', 'កំពង់សោម', 'sihanoukville', 'sihanouk', 'kmpong som'],
    zoom: 13,
  },
  {
    nameKm: 'ខេត្តកណ្តាល (ក្រុងតាខ្មៅ)',
    nameEn: 'Kandal Province (Ta Khmau City)',
    category: 'province',
    categoryKm: '🏛️ ខេត្ត',
    lat: 11.4833,
    lng: 104.9500,
    keywords: ['កណ្តាល', 'តាខ្មៅ', 'kandal', 'ta khmau'],
    zoom: 13,
  },
  {
    nameKm: 'ខេត្តតាកែវ (ក្រុងដូនកែវ)',
    nameEn: 'Takeo Province (Doun Kaev City)',
    category: 'province',
    categoryKm: '🏛️ ខេត្ត',
    lat: 10.9908,
    lng: 104.7844,
    keywords: ['តាកែវ', 'ដូនកែវ', 'takeo', 'doun kaev'],
    zoom: 13,
  },
  {
    nameKm: 'ខេត្តកំពង់ចាម (ក្រុងកំពង់ចាម)',
    nameEn: 'Kampong Cham Province (City Center)',
    category: 'province',
    categoryKm: '🏛️ ខេត្ត',
    lat: 11.9934,
    lng: 105.4635,
    keywords: ['កំពង់ចាម', 'kampong cham'],
    zoom: 13,
  },
  {
    nameKm: 'ខេត្តត្បូងឃ្មុំ (ក្រុងសួង)',
    nameEn: 'Tboung Khmum Province (Suong City)',
    category: 'province',
    categoryKm: '🏛️ ខេត្ត',
    lat: 11.9167,
    lng: 105.6500,
    keywords: ['ត្បូងឃ្មុំ', 'សួង', 'tboung khmum', 'suong'],
    zoom: 13,
  },
  {
    nameKm: 'ខេត្តកំពង់ឆ្នាំង (ក្រុងកំពង់ឆ្នាំង)',
    nameEn: 'Kampong Chhnang Province (City Center)',
    category: 'province',
    categoryKm: '🏛️ ខេត្ត',
    lat: 12.2500,
    lng: 104.6667,
    keywords: ['កំពង់ឆ្នាំង', 'kampong chhnang'],
    zoom: 13,
  },
  {
    nameKm: 'ខេត្តកំពង់ធំ (ក្រុងស្ទឹងសែន)',
    nameEn: 'Kampong Thom Province (Stung Sen City)',
    category: 'province',
    categoryKm: '🏛️ ខេត្ត',
    lat: 12.7111,
    lng: 104.8887,
    keywords: ['កំពង់ធំ', 'ស្ទឹងសែន', 'kampong thom', 'stung sen'],
    zoom: 13,
  },
  {
    nameKm: 'ខេត្តស្វាយរៀង (ក្រុងស្វាយរៀង)',
    nameEn: 'Svay Rieng Province (City Center)',
    category: 'province',
    categoryKm: '🏛️ ខេត្ត',
    lat: 11.0878,
    lng: 105.7994,
    keywords: ['ស្វាយរៀង', 'បាវិត', 'svay rieng', 'bavet'],
    zoom: 13,
  },
  {
    nameKm: 'ខេត្តព្រៃវែង (ក្រុងព្រៃវែង)',
    nameEn: 'Prey Veng Province (City Center)',
    category: 'province',
    categoryKm: '🏛️ ខេត្ត',
    lat: 11.4868,
    lng: 105.3253,
    keywords: ['ព្រៃវែង', 'prey veng'],
    zoom: 13,
  },
  {
    nameKm: 'ខេត្តពោធិ៍សាត់ (ក្រុងពោធិ៍សាត់)',
    nameEn: 'Pursat Province (City Center)',
    category: 'province',
    categoryKm: '🏛️ ខេត្ត',
    lat: 12.5388,
    lng: 103.9192,
    keywords: ['ពោធិ៍សាត់', 'pursat'],
    zoom: 13,
  },
  {
    nameKm: 'ខេត្តបន្ទាយមានជ័យ (ក្រុងសិរីសោភ័ណ)',
    nameEn: 'Banteay Meanchey (Serei Saophoan)',
    category: 'province',
    categoryKm: '🏛️ ខេត្ត',
    lat: 13.5859,
    lng: 102.9737,
    keywords: ['បន្ទាយមានជ័យ', 'សិរីសោភ័ណ', 'banteay meanchey', 'serei saophoan'],
    zoom: 13,
  },
  {
    nameKm: 'ក្រុងប៉ោយប៉ែត (ខេត្តបន្ទាយមានជ័យ)',
    nameEn: 'Poipet City (Border City)',
    category: 'city',
    categoryKm: '🏙️ ក្រុង',
    lat: 13.6561,
    lng: 102.5630,
    keywords: ['ប៉ោយប៉ែត', 'poipet', 'ព្រំដែន'],
    zoom: 14,
  },
  {
    nameKm: 'ខេត្តកោះកុង (ក្រុងខេមរភូមិន្ទ)',
    nameEn: 'Koh Kong Province (Khemarak Phoumin City)',
    category: 'province',
    categoryKm: '🏛️ ខេត្ត',
    lat: 11.6153,
    lng: 102.9838,
    keywords: ['កោះកុង', 'ខេមរភូមិន្ទ', 'koh kong'],
    zoom: 13,
  },
  {
    nameKm: 'ខេត្តកែប (ក្រុងកែប)',
    nameEn: 'Kep Province (City Center)',
    category: 'province',
    categoryKm: '🏛️ ខេត្ត',
    lat: 10.4828,
    lng: 104.3167,
    keywords: ['កែប', 'kep', 'ឆ្នេរកែប'],
    zoom: 13,
  },
  {
    nameKm: 'ខេត្តប៉ៃលិន (ក្រុងប៉ៃលិន)',
    nameEn: 'Pailin Province (City Center)',
    category: 'province',
    categoryKm: '🏛️ ខេត្ត',
    lat: 12.8489,
    lng: 102.6093,
    keywords: ['ប៉ៃលិន', 'pailin'],
    zoom: 13,
  },
  {
    nameKm: 'ខេត្តក្រចេះ (ក្រុងក្រចេះ)',
    nameEn: 'Kratie Province (City Center)',
    category: 'province',
    categoryKm: '🏛️ ខេត្ត',
    lat: 12.4881,
    lng: 106.0188,
    keywords: ['ក្រចេះ', 'kratie'],
    zoom: 13,
  },
  {
    nameKm: 'ខេត្តស្ទឹងត្រែង (ក្រុងស្ទឹងត្រែង)',
    nameEn: 'Stung Treng Province (City Center)',
    category: 'province',
    categoryKm: '🏛️ ខេត្ត',
    lat: 13.5259,
    lng: 105.9683,
    keywords: ['ស្ទឹងត្រែង', 'stung treng'],
    zoom: 13,
  },
  {
    nameKm: 'ខេត្តរតនគិរី (ក្រុងបានលុង)',
    nameEn: 'Ratanakiri Province (Banlung City)',
    category: 'province',
    categoryKm: '🏛️ ខេត្ត',
    lat: 13.7394,
    lng: 106.9873,
    keywords: ['រតនគិរី', 'បានលុង', 'ratanakiri', 'banlung', 'បឹងយក្សឡោម'],
    zoom: 13,
  },
  {
    nameKm: 'ខេត្តមណ្ឌលគិរី (ក្រុងសែនមនោរម្យ)',
    nameEn: 'Mondulkiri Province (Senmonorom City)',
    category: 'province',
    categoryKm: '🏛️ ខេត្ត',
    lat: 12.4558,
    lng: 107.1881,
    keywords: ['មណ្ឌលគិរី', 'សែនមនោរម្យ', 'mondulkiri', 'senmonorom', 'ប៊ូស្រា'],
    zoom: 13,
  },
  {
    nameKm: 'ខេត្តព្រះវិហារ (ក្រុងត្បែងមានជ័យ)',
    nameEn: 'Preah Vihear Province (Tbeng Meanchey)',
    category: 'province',
    categoryKm: '🏛️ ខេត្ត',
    lat: 13.8073,
    lng: 104.9805,
    keywords: ['ព្រះវិហារ', 'ត្បែងមានជ័យ', 'preah vihear', 'tbeng meanchey'],
    zoom: 13,
  },
  {
    nameKm: 'ខេត្តឧត្តរមានជ័យ (ក្រុងសំរោង)',
    nameEn: 'Oddar Meanchey (Samraong City)',
    category: 'province',
    categoryKm: '🏛️ ខេត្ត',
    lat: 14.1818,
    lng: 103.5176,
    keywords: ['ឧត្តរមានជ័យ', 'សំរោង', 'oddar meanchey', 'samraong'],
    zoom: 13,
  },

  // --- KAMPONG SPEU SPECIFIC LOCATIONS ---
  {
    nameKm: 'សាលាខេត្តកំពង់ស្ពឺ (Kampong Speu Provincial Hall)',
    nameEn: 'Kampong Speu Provincial Administration Hall',
    category: 'government',
    categoryKm: '🏛️ សាលាខេត្ត',
    lat: 11.4589,
    lng: 104.5245,
    keywords: ['កំពង់ស្ពឺ', 'សាលាខេត្ត', 'kampong speu hall', 'provincial hall'],
    zoom: 17,
  },
  {
    nameKm: 'វិទ្យាស្ថានបច្ចេកវិទ្យាកំពង់ស្ពឺ (KSIT)',
    nameEn: 'Kampong Speu Institute of Technology (KSIT)',
    category: 'education',
    categoryKm: '🏫 វិទ្យាស្ថាន / សាលា',
    lat: 11.4650,
    lng: 104.5280,
    keywords: ['កំពង់ស្ពឺ', 'វិទ្យាស្ថាន', 'ksit', 'kampong speu institute', 'សាលាកំពង់ស្ពឺ'],
    zoom: 17,
  },
  {
    nameKm: 'ពហុកីឡដ្ឋានខេត្តកំពង់ស្ពឺ (Kampong Speu Stadium)',
    nameEn: 'Kampong Speu Provincial Stadium',
    category: 'landmark',
    categoryKm: '🏟️ ពហុកីឡដ្ឋាន',
    lat: 11.4881,
    lng: 104.4834,
    keywords: ['កំពង់ស្ពឺ', 'កីឡដ្ឋាន', 'stadium', 'kampong speu stadium'],
    zoom: 17,
  },
  {
    nameKm: 'មន្ទីរពេទ្យបង្អែកខេត្តកំពង់ស្ពឺ (Referral Hospital)',
    nameEn: 'Kampong Speu Provincial Referral Hospital',
    category: 'hospital',
    categoryKm: '🏥 មន្ទីរពេទ្យ',
    lat: 11.4706,
    lng: 104.5393,
    keywords: ['កំពង់ស្ពឺ', 'មន្ទីរពេទ្យ', 'hospital', 'ពេទ្យកំពង់ស្ពឺ', 'kampong speu hospital'],
    zoom: 17,
  },
  {
    nameKm: 'ផ្សារកំពង់ស្ពឺ (Kampong Speu Central Market)',
    nameEn: 'Kampong Speu Central Market (Chbar Mon)',
    category: 'market',
    categoryKm: '🛒 ផ្សារ',
    lat: 11.4530,
    lng: 104.5220,
    keywords: ['កំពង់ស្ពឺ', 'ផ្សារ', 'market', 'ផ្សារច្បារមន', 'ផ្សារកំពង់ស្ពឺ'],
    zoom: 17,
  },
  {
    nameKm: 'ឧទ្យានជាតិព្រះសុរាម្រិត-កុសុមៈ គិរីរម្យ (Kirirom)',
    nameEn: 'Kirirom National Park (Kampong Speu)',
    category: 'landmark',
    categoryKm: '🌲 ឧទ្យានជាតិ',
    lat: 11.3194,
    lng: 104.0531,
    keywords: ['គិរីរម្យ', 'គីរីរម្យ', 'kirirom', 'កំពង់ស្ពឺ', 'national park'],
    zoom: 14,
  },
  {
    nameKm: 'ភ្នំឱរ៉ាល់ (កំពូលភ្នំខ្ពស់ជាងគេនៅកម្ពុជា - ស្រុកឱរ៉ាល់)',
    nameEn: 'Mount Aoral (Aoral District, Kampong Speu)',
    category: 'landmark',
    categoryKm: '🏔️ ភ្នំឱរ៉ាល់',
    lat: 11.9167,
    lng: 104.1667,
    keywords: ['ឱរ៉ាល់', 'កំពង់ស្ពឺ', 'aoral', 'mount aoral', 'ភ្នំឱរ៉ាល់'],
    zoom: 13,
  },
  {
    nameKm: 'ស្រុកគងពិសី (ខេត្តកំពង់ស្ពឺ)',
    nameEn: 'Kong Pisei District (Kampong Speu)',
    category: 'district',
    categoryKm: '🏙️ ស្រុក',
    lat: 11.2941,
    lng: 104.6262,
    keywords: ['គងពិសី', 'ស្រុកគងពិសី', 'kong pisei', 'កំពង់ស្ពឺ'],
    zoom: 14,
  },
  {
    nameKm: 'ស្រុកសំរោងទង (ខេត្តកំពង់ស្ពឺ)',
    nameEn: 'Samraong Tong District (Kampong Speu)',
    category: 'district',
    categoryKm: '🏙️ ស្រុក',
    lat: 11.4855,
    lng: 104.5881,
    keywords: ['សំរោងទង', 'ស្រុកសំរោងទង', 'samraong tong', 'កំពង់ស្ពឺ'],
    zoom: 14,
  },
  {
    nameKm: 'ស្រុកភ្នំស្រួច (ខេត្តកំពង់ស្ពឺ)',
    nameEn: 'Phnom Sruoch District (Kampong Speu)',
    category: 'district',
    categoryKm: '🏙️ ស្រុក',
    lat: 11.3169,
    lng: 104.3114,
    keywords: ['ភ្នំស្រួច', 'ស្រុកភ្នំស្រួច', 'phnom sruoch', 'កំពង់ស្ពឺ'],
    zoom: 14,
  },
  {
    nameKm: 'ស្រុកបរសេដ្ឋ (ខេត្តកំពង់ស្ពឺ)',
    nameEn: 'Borsedth District (Kampong Speu)',
    category: 'district',
    categoryKm: '🏙️ ស្រុក',
    lat: 11.2333,
    lng: 104.5667,
    keywords: ['បរសេដ្ឋ', 'ស្រុកបរសេដ្ឋ', 'borsedth', 'កំពង់ស្ពឺ'],
    zoom: 14,
  },
  {
    nameKm: 'ស្រុកថ្ពង (ខេត្តកំពង់ស្ពឺ)',
    nameEn: 'Thpong District (Kampong Speu)',
    category: 'district',
    categoryKm: '🏙️ ស្រុក',
    lat: 11.7500,
    lng: 104.4167,
    keywords: ['ថ្ពង', 'ស្រុកថ្ពង', 'thpong', 'កំពង់ស្ពឺ'],
    zoom: 14,
  },
  {
    nameKm: 'ក្រុងឧដុង្គម៉ែជ័យ (ខេត្តកំពង់ស្ពឺ)',
    nameEn: 'Odongk Mae Chey City (Kampong Speu)',
    category: 'city',
    categoryKm: '🏙️ ក្រុង',
    lat: 11.8214,
    lng: 104.7450,
    keywords: ['ឧដុង្គ', 'ឧដុង្គម៉ែជ័យ', 'odongk', 'កំពង់ស្ពឺ'],
    zoom: 14,
  },

  // --- MAJOR UNIVERSITIES & SCHOOLS ---
  {
    nameKm: 'សាកលវិទ្យាល័យឌីជីថលកម្ពុជា (Digital University of Cambodia - DUC)',
    nameEn: 'Digital University of Cambodia (DUC Main Campus)',
    category: 'education',
    categoryKm: '🏫 សាកលវិទ្យាល័យឌីជីថល',
    lat: 11.4168125,
    lng: 104.7664375,
    keywords: [
      'សាកលវិទ្យាល័យឌីជីថលកម្ពុជា',
      'ឌីជីថលកម្ពុជា',
      'digital university of cambodia',
      'digital university',
      'duc',
      'prey totueng',
      'ព្រៃទទឹង',
      'ផ្លូវជាតិលេខ៣',
      'kampong speu',
      'kandal'
    ],
    zoom: 18,
  },
  {
    nameKm: 'សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ (RUPP - មហាវិថីសហព័ន្ធរុស្ស៊ី)',
    nameEn: 'Royal University of Phnom Penh (RUPP Main Campus)',
    category: 'education',
    categoryKm: '🏫 សាកលវិទ្យាល័យ',
    lat: 11.5684,
    lng: 104.8912,
    keywords: ['rupp', 'ភូមិន្ទភ្នំពេញ', 'សាកលវិទ្យាល័យភូមិន្ទ', 'royal university'],
    zoom: 18,
  },
  {
    nameKm: 'វិទ្យាស្ថានភាសាបរទេស (IFL - RUPP Campus)',
    nameEn: 'Institute of Foreign Languages (IFL)',
    category: 'education',
    categoryKm: '🏫 វិទ្យាស្ថាន IFL',
    lat: 11.5694,
    lng: 104.8906,
    keywords: ['ifl', 'ភាសាបរទេស', 'វិទ្យាស្ថានភាសា'],
    zoom: 18,
  },
  {
    nameKm: 'វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា (ITC - សាលាតិចណូ)',
    nameEn: 'Institute of Technology of Cambodia (ITC Techno)',
    category: 'education',
    categoryKm: '🏫 តិចណូ ITC',
    lat: 11.5721,
    lng: 104.8988,
    keywords: ['itc', 'techno', 'តិចណូ', 'បច្ចេកវិទ្យា'],
    zoom: 18,
  },
  {
    nameKm: 'សាកលវិទ្យាល័យជាតិគ្រប់គ្រង (NUM)',
    nameEn: 'National University of Management (NUM)',
    category: 'education',
    categoryKm: '🏫 សាកលវិទ្យាល័យ',
    lat: 11.5732,
    lng: 104.9189,
    keywords: ['num', 'ជាតិគ្រប់គ្រង', 'សាកលវិទ្យាល័យជាតិ'],
    zoom: 18,
  },
  {
    nameKm: 'សាកលវិទ្យាល័យភូមិន្ទនីតិសាស្ត្រ និងវិទ្យាសាស្ត្រសេដ្ឋកិច្ច (RULE)',
    nameEn: 'Royal University of Law and Economics (RULE)',
    category: 'education',
    categoryKm: '🏫 សាកលវិទ្យាល័យ',
    lat: 11.5398,
    lng: 104.9288,
    keywords: ['rule', 'ច្បាប់', 'សេដ្ឋកិច្ច', 'នីតិសាស្ត្រ'],
    zoom: 18,
  },
  {
    nameKm: 'សាកលវិទ្យាល័យវិទ្យាសាស្ត្រសុខាភិបាល (UHS - សាលាពេទ្យ)',
    nameEn: 'University of Health Sciences (UHS)',
    category: 'education',
    categoryKm: '🏫 សាលាពេទ្យ UHS',
    lat: 11.5680,
    lng: 104.9180,
    keywords: ['uhs', 'សាលាពេទ្យ', 'សុខាភិបាល', 'ពេទ្យ'],
    zoom: 18,
  },
  {
    nameKm: 'សាកលវិទ្យាល័យភូមិន្ទកសិកម្ម (RUA - ចំការដូង)',
    nameEn: 'Royal University of Agriculture (RUA Chamkar Daung)',
    category: 'education',
    categoryKm: '🏫 សាកលវិទ្យាល័យ',
    lat: 11.5097,
    lng: 104.9015,
    keywords: ['rua', 'ចំការដូង', 'កសិកម្ម', 'ភូមិន្ទកសិកម្ម'],
    zoom: 17,
  },
  {
    nameKm: 'សាកលវិទ្យាល័យន័រតុន (Norton University - ជ្រោយចង្វារ)',
    nameEn: 'Norton University (Chroy Changvar Campus)',
    category: 'education',
    categoryKm: '🏫 សាកលវិទ្យាល័យ',
    lat: 11.5898,
    lng: 104.9348,
    keywords: ['norton', 'ន័រតុន', 'ជ្រោយចង្វារ'],
    zoom: 18,
  },
  {
    nameKm: 'សាកលវិទ្យាល័យ បៀលប្រាយ (Build Bright University - BBU)',
    nameEn: 'Build Bright University (Phnom Penh)',
    category: 'education',
    categoryKm: '🏫 សាកលវិទ្យាល័យ',
    lat: 11.5435,
    lng: 104.9142,
    keywords: ['bbu', 'build bright', 'បៀលប្រាយ'],
    zoom: 18,
  },
  {
    nameKm: 'សាកលវិទ្យាល័យបញ្ញាសាស្ត្រ (PUC - មហាវិថីព្រះនរោត្តម)',
    nameEn: 'Paññāsāstra University of Cambodia (PUC)',
    category: 'education',
    categoryKm: '🏫 សាកលវិទ្យាល័យ',
    lat: 11.5540,
    lng: 104.9270,
    keywords: ['puc', 'បញ្ញាសាស្ត្រ', 'pannasastra'],
    zoom: 18,
  },
  {
    nameKm: 'វិទ្យាស្ថាន វ៉ាន់ដា (Vanda Institute)',
    nameEn: 'Vanda Institute of Accounting',
    category: 'education',
    categoryKm: '🏫 វិទ្យាស្ថាន វ៉ាន់ដា',
    lat: 11.5422,
    lng: 104.9123,
    keywords: ['vanda', 'វ៉ាន់ដា', 'គណនេយ្យ'],
    zoom: 18,
  },

  // --- MAJOR MALLS & MARKETS ---
  {
    nameKm: 'ផ្សារទំនើប អ៊ីអន ១ (AEON Mall Phnom Penh - សម្តេចសុធារស)',
    nameEn: 'AEON Mall 1 (Samdach Sothearos Blvd)',
    category: 'mall',
    categoryKm: '🛒 ផ្សារទំនើប',
    lat: 11.5478,
    lng: 104.9317,
    keywords: ['aeon', 'aeon 1', 'អ៊ីអន', 'អ៊ីអន១', 'ផ្សារទំនើប'],
    zoom: 18,
  },
  {
    nameKm: 'ផ្សារទំនើប អ៊ីអន ២ (AEON Mall Sen Sok City)',
    nameEn: 'AEON Mall 2 Sen Sok City',
    category: 'mall',
    categoryKm: '🛒 ផ្សារទំនើប',
    lat: 11.5975,
    lng: 104.8785,
    keywords: ['aeon 2', 'sen sok', 'សែនសុខ', 'អ៊ីអន២'],
    zoom: 18,
  },
  {
    nameKm: 'ផ្សារទំនើប អ៊ីអន ៣ (AEON Mall Meanchey - ផ្លូវ៦០ម៉ែត្រ)',
    nameEn: 'AEON Mall 3 Meanchey (Hun Sen Blvd 60m)',
    category: 'mall',
    categoryKm: '🛒 ផ្សារទំនើប',
    lat: 11.4883,
    lng: 104.9258,
    keywords: ['aeon 3', 'meanchey', 'មានជ័យ', 'ផ្លូវ៦០ម៉ែត្រ', 'អ៊ីអន៣'],
    zoom: 18,
  },
  {
    nameKm: 'ផ្សារទំនើប ជីប ម៉ុង ២៧១ (Chip Mong 271 Mega Mall)',
    nameEn: 'Chip Mong 271 Mega Mall',
    category: 'mall',
    categoryKm: '🛒 ផ្សារទំនើប',
    lat: 11.5283,
    lng: 104.9100,
    keywords: ['chip mong 271', 'chip mong', 'ជីបម៉ុង', '២៧១'],
    zoom: 18,
  },
  {
    nameKm: 'ផ្សារធំថ្មី (Central Market - រាជធានីភ្នំពេញ)',
    nameEn: 'Phsar Thmey (Central Market)',
    category: 'market',
    categoryKm: '🛒 ផ្សារ',
    lat: 11.5694,
    lng: 104.9219,
    keywords: ['ផ្សារធំថ្មី', 'central market', 'phsar thmey'],
    zoom: 18,
  },
  {
    nameKm: 'ផ្សារអូឡាំពិក (Olympic Market)',
    nameEn: 'Olympic Market (Phnom Penh)',
    category: 'market',
    categoryKm: '🛒 ផ្សារ',
    lat: 11.5525,
    lng: 104.9142,
    keywords: ['អូឡាំពិក', 'olympic market', 'ផ្សារអូឡាំពិក'],
    zoom: 18,
  },
  {
    nameKm: 'ផ្សារអូរឫស្សី (Orussey Market)',
    nameEn: 'Orussey Market (Phnom Penh)',
    category: 'market',
    categoryKm: '🛒 ផ្សារ',
    lat: 11.5630,
    lng: 104.9167,
    keywords: ['អូរឫស្សី', 'orussey', 'ផ្សារអូរឫស្សី'],
    zoom: 18,
  },
  {
    nameKm: 'ផ្សារទួលទំពូង (Russian Market)',
    nameEn: 'Toul Tompoung Market (Russian Market)',
    category: 'market',
    categoryKm: '🛒 ផ្សារ',
    lat: 11.5408,
    lng: 104.9147,
    keywords: ['ទួលទំពូង', 'russian market', 'ផ្សាររុស្ស៊ី'],
    zoom: 18,
  },

  // --- MAJOR HOSPITALS ---
  {
    nameKm: 'មន្ទីរពេទ្យកាល់ម៉ែត (Calmette Hospital)',
    nameEn: 'Calmette Hospital (Phnom Penh)',
    category: 'hospital',
    categoryKm: '🏥 មន្ទីរពេទ្យ',
    lat: 11.5815,
    lng: 104.9189,
    keywords: ['កាល់ម៉ែត', 'calmette', 'ពេទ្យកាល់ម៉ែត'],
    zoom: 18,
  },
  {
    nameKm: 'មន្ទីរពេទ្យមិត្តភាពខ្មែរ-សូវៀត (មន្ទីរពេទ្យរុស្ស៊ី)',
    nameEn: 'Khmer-Soviet Friendship Hospital (Russian Hospital)',
    category: 'hospital',
    categoryKm: '🏥 មន្ទីរពេទ្យ',
    lat: 11.5425,
    lng: 104.9035,
    keywords: ['ពេទ្យរុស្ស៊ី', 'ខ្មែរសូវៀត', 'khmer soviet', 'russian hospital'],
    zoom: 18,
  },
  {
    nameKm: 'មន្ទីរពេទ្យព្រះកុសុមៈ (ពេទ្យលោកសង្ឃ - មិត្តភាពកម្ពុជា-ចិន)',
    nameEn: 'Preah Kossamak Hospital (Lok Sang Hospital)',
    category: 'hospital',
    categoryKm: '🏥 មន្ទីរពេទ្យ',
    lat: 11.5683,
    lng: 104.8988,
    keywords: ['ពេទ្យលោកសង្ឃ', 'កុសុមៈ', 'kossamak', 'lok sang'],
    zoom: 18,
  },
  {
    nameKm: 'មន្ទីរពេទ្យគន្ធបុប្ផា (Kantha Bopha Hospital)',
    nameEn: 'Kantha Bopha Children Hospital',
    category: 'hospital',
    categoryKm: '🏥 មន្ទីរពេទ្យ',
    lat: 11.5760,
    lng: 104.9270,
    keywords: ['គន្ធបុប្ផា', 'kantha bopha', 'ពេទ្យកុមារ'],
    zoom: 18,
  },

  // --- LANDMARKS ---
  {
    nameKm: 'ព្រះបរមរាជវាំង (Royal Palace)',
    nameEn: 'Royal Palace of Cambodia',
    category: 'landmark',
    categoryKm: '🏰 ព្រះបរមរាជវាំង',
    lat: 11.5638,
    lng: 104.9315,
    keywords: ['ព្រះបរមរាជវាំង', 'royal palace', 'វាំង'],
    zoom: 17,
  },
  {
    nameKm: 'រមណីយដ្ឋាន វត្តភ្នំ (Wat Phnom Historical Sanctuary)',
    nameEn: 'Wat Phnom Sanctuary & Park',
    category: 'landmark',
    categoryKm: '📍 វត្តភ្នំ',
    lat: 11.5761,
    lng: 104.9230,
    keywords: ['វត្តភ្នំ', 'wat phnom', 'ដូនពេញ'],
    zoom: 17,
  },
  {
    nameKm: 'វិមានឯករាជ្យ (Independence Monument)',
    nameEn: 'Independence Monument (Vimean Ekareach)',
    category: 'landmark',
    categoryKm: '📍 វិមានឯករាជ្យ',
    lat: 11.5564,
    lng: 104.9282,
    keywords: ['វិមានឯករាជ្យ', 'independence monument'],
    zoom: 17,
  },
  {
    nameKm: 'ពហុកីឡដ្ឋានជាតិអូឡាំពិក (Olympic National Stadium)',
    nameEn: 'National Olympic Stadium (Phnom Penh)',
    category: 'landmark',
    categoryKm: '🏟️ ពហុកីឡដ្ឋានជាតិ',
    lat: 11.5583,
    lng: 104.9125,
    keywords: ['អូឡាំពិក', 'olympic stadium', 'កីឡដ្ឋាន'],
    zoom: 17,
  },
  {
    nameKm: 'ពហុកីឡដ្ឋានជាតិមរតកតេជោ (Morodok Techo National Stadium)',
    nameEn: 'Morodok Techo National Stadium',
    category: 'landmark',
    categoryKm: '🏟️ មរតកតេជោ',
    lat: 11.6781,
    lng: 104.8872,
    keywords: ['មរតកតេជោ', 'morodok techo', 'stadium'],
    zoom: 17,
  },
  {
    nameKm: 'ប្រាសាទអង្គរវត្ត (Angkor Wat Temple - សៀមរាប)',
    nameEn: 'Angkor Wat Temple Complex (Siem Reap)',
    category: 'landmark',
    categoryKm: '🏛️ ប្រាសាទអង្គរវត្ត',
    lat: 13.4125,
    lng: 103.8670,
    keywords: ['អង្គរវត្ត', 'angkor wat', 'ប្រាសាទ'],
    zoom: 16,
  },
];

/**
 * Common Khmer to English transliteration map for Cambodian provinces & cities
 */
export const TRANSLITERATION_MAP = {
  'កំពង់ស្ពឺ': 'Kampong Speu',
  'កំពុងស្ពឺ': 'Kampong Speu',
  'ច្បារមន': 'Chbar Mon',
  'សៀមរាប': 'Siem Reap',
  'បាត់ដំបង': 'Battambang',
  'ភ្នំពេញ': 'Phnom Penh',
  'កំពត': 'Kampot',
  'កណ្តាល': 'Kandal',
  'តាខ្មៅ': 'Ta Khmau',
  'តាកែវ': 'Takeo',
  'កំពង់ចាម': 'Kampong Cham',
  'ត្បូងឃ្មុំ': 'Tboung Khmum',
  'កំពង់ឆ្នាំង': 'Kampong Chhnang',
  'កំពង់ធំ': 'Kampong Thom',
  'ស្វាយរៀង': 'Svay Rieng',
  'ព្រៃវែង': 'Prey Veng',
  'ពោធិ៍សាត់': 'Pursat',
  'បន្ទាយមានជ័យ': 'Banteay Meanchey',
  'ប៉ោយប៉ែត': 'Poipet',
  'កោះកុង': 'Koh Kong',
  'កែប': 'Kep',
  'ប៉ៃលិន': 'Pailin',
  'ក្រចេះ': 'Kratie',
  'ស្ទឹងត្រែង': 'Stung Treng',
  'រតនគិរី': 'Ratanakiri',
  'មណ្ឌលគិរី': 'Mondulkiri',
  'ព្រះវិហារ': 'Preah Vihear',
  'ឧត្តរមានជ័យ': 'Oddar Meanchey',
  'ព្រះសីហនុ': 'Sihanoukville',
  'កំពង់សោម': 'Kampong Som',
  'ទួលគោក': 'Toul Kork',
  'សែនសុខ': 'Sen Sok',
  'ដូនពេញ': 'Daun Penh',
  'ចំការមន': 'Chamkar Mon',
  'បឹងកេងកង': 'Boeung Keng Kang',
  'មានជ័យ': 'Meanchey',
  'ជ្រោយចង្វារ': 'Chroy Changvar',
  'ឫស្សីកែវ': 'Russey Keo',
  'ពោធិ៍សែនជ័យ': 'Por Senchey',
  'ច្បារអំពៅ': 'Chbar Ampov',
  'ដង្កោ': 'Dangkao',
  'ព្រែកព្នៅ': 'Prek Pnov',
  'សាកលវិទ្យាល័យឌីជីថលកម្ពុជា': 'Digital University of Cambodia',
  'ឌីជីថលកម្ពុជា': 'Digital University of Cambodia',
  'កំបូល': 'Kamboul',
};

/**
 * Parse Google Maps Link, Plus Code, or direct GPS coordinates
 * Supports:
 * - Direct coordinates: "11.4168125, 104.7664375" or "11.4168 104.7664"
 * - Full Google Maps URLs: https://www.google.com/maps/place/.../@11.4169,104.7631...
 * - Google Maps short URLs or coordinates parameters (!3d11.4168!4d104.7664)
 */
export function parseLocationInput(input) {
  if (!input) return null;
  const str = input.trim();

  // 1. Direct GPS Coordinates: "11.4168125, 104.7664375"
  const coordRegex = /^([+-]?\d+(?:\.\d+)?)[,\s]+([+-]?\d+(?:\.\d+)?)$/;
  const coordMatch = str.match(coordRegex);
  if (coordMatch) {
    const lat = parseFloat(coordMatch[1]);
    const lng = parseFloat(coordMatch[2]);
    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return {
        id: `direct-gps-${lat}-${lng}`,
        lat,
        lng,
        name: `📍 កូអរដោនេ GPS (${lat.toFixed(6)}, ${lng.toFixed(6)})`,
        nameSecondary: 'ទីតាំង GPS បានបញ្ចូលដោយផ្ទាល់ពី Google Maps',
        category: '📍 GPS Coordinate',
        zoom: 18,
        source: 'direct-gps',
      };
    }
  }

  // 2. Google Maps URL Parser
  if (
    str.includes('google.com/maps') ||
    str.includes('maps.google.com') ||
    str.includes('goo.gl/maps') ||
    str.includes('maps.app.goo.gl')
  ) {
    let lat = null;
    let lng = null;

    // Check for !3dLat!4dLng (Exact POI coordinates in Google Maps URLs)
    const dMatch = str.match(/!3d([+-]?\d+(?:\.\d+)?)(?:!4d|%214d)([+-]?\d+(?:\.\d+)?)/);
    if (dMatch) {
      lat = parseFloat(dMatch[1]);
      lng = parseFloat(dMatch[2]);
    } else {
      // Check for @lat,lng
      const atMatch = str.match(/@([+-]?\d+(?:\.\d+)?),([+-]?\d+(?:\.\d+)?)/);
      if (atMatch) {
        lat = parseFloat(atMatch[1]);
        lng = parseFloat(atMatch[2]);
      } else {
        // Check for ?q=lat,lng
        const qMatch = str.match(/[?&](?:q|ll)=([+-]?\d+(?:\.\d+)?),([+-]?\d+(?:\.\d+)?)/);
        if (qMatch) {
          lat = parseFloat(qMatch[1]);
          lng = parseFloat(qMatch[2]);
        }
      }
    }

    if (lat !== null && lng !== null) {
      const placeMatch = str.match(/\/place\/([^/@?]+)/);
      const placeName = placeMatch
        ? decodeURIComponent(placeMatch[1].replace(/\+/g, ' '))
        : 'Google Maps Location';

      return {
        id: `gmaps-link-${lat}-${lng}`,
        lat,
        lng,
        name: `📍 ${placeName}`,
        nameSecondary: `ទាញចេញពី Google Maps Link (${lat.toFixed(6)}, ${lng.toFixed(6)})`,
        category: '🗺️ Google Maps Link',
        zoom: 18,
        source: 'google-maps',
      };
    }
  }

  return null;
}

/**
 * Search Cambodia locations locally with high-speed fuzzy keyword matching
 * @param {string} query
 * @returns {Array}
 */
export function searchLocalCambodiaLocations(query) {
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();

  return CAMBODIA_LOCATIONS.filter((loc) => {
    if (loc.nameKm.toLowerCase().includes(q) || loc.nameEn.toLowerCase().includes(q)) {
      return true;
    }
    return loc.keywords.some((kw) => kw.toLowerCase().includes(q) || q.includes(kw.toLowerCase()));
  }).slice(0, 15);
}

