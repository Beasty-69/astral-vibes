
export interface Track {
  id: string;
  title: string;
  artist: {
    name: string;
  };
  album: {
    title: string;
    cover: string;
    cover_medium: string;
    cover_xl?: string;
  };
  duration: number;
  preview: string;
}
