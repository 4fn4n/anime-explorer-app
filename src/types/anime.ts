export interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
      large_image_url: string;
    };
  };
  type: string | null;
  score: number | null;
  episodes: number | null;
  synopsis: string | null;
  rating: string | null;
  genres: Genre[];
}

export interface Genre {
  mal_id: number;
  name: string;
}

export interface PaginationInfo {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
}

export interface AnimeListResponse {
  data: Anime[];
  pagination: PaginationInfo;
}

export interface AnimeDetail extends Anime {
  title_english: string | null;
  title_japanese: string | null;
  background: string | null;
  status: string;
  duration: string;
  aired: { string: string };
  rank: number | null;
  popularity: number | null;
  scored_by: number | null;
  studios: Studio[];
  trailer: {
    youtube_id: string | null;
    embed_url: string | null;
  };
}

export interface Studio {
  mal_id: number;
  name: string;
}

export interface GenreListResponse {
  data: Genre[];
}
