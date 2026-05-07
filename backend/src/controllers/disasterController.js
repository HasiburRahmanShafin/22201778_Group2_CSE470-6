// Mock disaster history data – later you can fetch from DB
const disasterHistory = [
  {
    id: 1,
    type: "flood",
    title: "Sylhet Mega Flood",
    date: "June 2022",
    severity: "severe",
    affected: "7.2 million",
    damage: "৳12,000 crore",
    description: "Worst flooding in 122 years.",
    fullDescription:
      "This catastrophic flood submerged major districts including Sylhet and Sunamganj. Thousands of homes, roads, and educational institutions were damaged. Millions of people were stranded for days due to continuous rainfall and river overflow.",
    thumbnail: "/images/sylhet-thumb.jpg",
    image: "/images/sylhet-full.jpg"
  },

  {
    id: 2,
    type: "cyclone",
    title: "Cyclone Sidr",
    date: "November 2007",
    severity: "severe",
    affected: "8.9 million",
    damage: "৳10,000 crore",
    description: "One of the deadliest cyclones in Bangladesh.",
    fullDescription:
      "Cyclone Sidr struck the southwestern coast with wind speeds up to 240 km/h. Coastal districts such as Barguna, Patuakhali, and Bagerhat suffered extensive damage, including embankment collapse, crop destruction, and loss of thousands of lives.",
    thumbnail: "/images/sidr-thumb.jpg",
    image: "/images/sidr-full.jpg"
  },

  {
    id: 3,
    type: "flood",
    title: "Great Flood of 1998",
    date: "July 1998",
    severity: "extreme",
    affected: "30 million",
    damage: "৳20,000 crore",
    description: "One of the largest floods in Bangladesh history.",
    fullDescription:
      "This historic flood lasted from July to September and affected more than 75% of Bangladesh. Roads, bridges, farmlands, and water sources were severely damaged. It remains one of the worst monsoon disasters in the country’s history.",
    thumbnail: "/images/flood1998-thumb.jpg",
    image: "/images/flood1998-full.jpg"
  },

  {
    id: 4,
    type: "cyclone",
    title: "1991 Chittagong Cyclone",
    date: "April 1991",
    severity: "extreme",
    affected: "13.4 million",
    damage: "৳15,000 crore",
    description: "One of the deadliest cyclones ever recorded.",
    fullDescription:
      "The cyclone hit southeastern Bangladesh near Chittagong with a devastating storm surge. Entire villages were washed away, leaving millions homeless. This event led to major improvements in cyclone shelters nationwide.",
    thumbnail: "/images/chittagong1991-thumb.jpg",
    image: "/images/chittagong1991-full.jpg"
  },

  {
    id: 5,
    type: "cyclone",
    title: "Cyclone Amphan",
    date: "May 2020",
    severity: "severe",
    affected: "2.6 million",
    damage: "৳12,700 crore",
    description: "Super cyclone affected coastal southwest Bangladesh.",
    fullDescription:
      "Cyclone Amphan caused severe destruction in Khulna, Satkhira, and Barisal divisions. Embankments collapsed, villages were flooded by tidal surges, and fisheries suffered major losses.",
    thumbnail: "/images/amphan-thumb.jpg",
    image: "/images/amphan-full.jpg"
  },

  {
    id: 6,
    type: "earthquake",
    title: "Srimangal Earthquake",
    date: "July 1918",
    severity: "moderate",
    affected: "150,000",
    damage: "৳500 crore",
    description: "Major historical earthquake in northeastern Bangladesh.",
    fullDescription:
      "The 1918 Srimangal earthquake was one of the most significant seismic events in Bangladesh’s history. It caused structural damage in Sylhet and surrounding regions and remains important in seismic risk studies.",
    thumbnail: "/images/srimangal-thumb.jpg",
    image: "/images/srimangal-full.jpg"
  },

  {
    id: 7,
    type: "flood",
    title: "1988 Bangladesh Flood",
    date: "August 1988",
    severity: "severe",
    affected: "45 million",
    damage: "৳18,000 crore",
    description: "Massive nationwide monsoon flood.",
    fullDescription:
      "The 1988 flood inundated large parts of Dhaka and central Bangladesh. It severely affected transportation, housing, and agriculture, making it one of the most remembered disasters in the country.",
    thumbnail: "/images/flood1988-thumb.jpg",
    image: "/images/flood1988-full.jpg"
  }
];

exports.getDisasterHistory = async (req, res) => {
  res.json(disasterHistory);
};