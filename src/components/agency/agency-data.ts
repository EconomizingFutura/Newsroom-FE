// Simple curated list. Add/edit agencies as needed.
// Using Google s2 favicons for lightweight brand icons.

export type Agency = {
  id: string;
  name: string;
  url: string;
  domain: string;
  color: string; // a subtle hover glow background
};

export const agencies: Agency[] = [
  {
    id: "pti",
    name: "PTI",
    url: "https://www.ptinews.com/",
    domain: "ptinews.com",
    color: "group-hover:bg-emerald-50",
  },
  {
    id: "ani",
    name: "ANI",
    url: "https://aninews.in/",
    domain: "aninews.in",
    color: "group-hover:bg-emerald-50",
  },
  {
    id: "bbc",
    name: "BBC",
    url: "https://www.bbc.com",
    domain: "bbc.com",
    color: "group-hover:bg-emerald-50",
  },
  {
    id: "nyt",
    name: "The New York Times",
    url: "https://www.nytimes.com",
    domain: "nytimes.com",
    color: "group-hover:bg-emerald-50",
  },
  {
    id: "reuters",
    name: "Reuters",
    url: "https://www.reuters.com",
    domain: "reuters.com",
    color: "group-hover:bg-emerald-50",
  },
  {
    id: "wapo",
    name: "The Washington Post",
    url: "https://www.washingtonpost.com",
    domain: "washingtonpost.com",
    color: "group-hover:bg-emerald-50",
  },
  {
    id: "guardian",
    name: "The Guardian",
    url: "https://www.theguardian.com",
    domain: "theguardian.com",
    color: "group-hover:bg-emerald-50",
  },
  {
    id: "aljazeera",
    name: "Al Jazeera",
    url: "https://www.aljazeera.com",
    domain: "aljazeera.com",
    color: "group-hover:bg-emerald-50",
  },
  {
    id: "ap",
    name: "Associated Press",
    url: "https://apnews.com",
    domain: "apnews.com",
    color: "group-hover:bg-emerald-50",
  },
  {
    id: "bloomberg",
    name: "Bloomberg",
    url: "https://www.bloomberg.com",
    domain: "bloomberg.com",
    color: "group-hover:bg-emerald-50",
  },
  {
    id: "cnn",
    name: "CNN",
    url: "https://www.cnn.com",
    domain: "cnn.com",
    color: "group-hover:bg-emerald-50",
  },
  {
    id: "hindu",
    name: "The Hindu",
    url: "https://www.thehindu.com",
    domain: "thehindu.com",
    color: "group-hover:bg-emerald-50",
  },
  {
    id: "ndtv",
    name: "NDTV",
    url: "https://www.ndtv.com",
    domain: "ndtv.com",
    color: "group-hover:bg-emerald-50",
  },
  {
    id: "toi",
    name: "The Times of India",
    url: "https://timesofindia.indiatimes.com",
    domain: "indiatimes.com",
    color: "group-hover:bg-emerald-50",
  },
];
