import type { Play } from "../../../model";

interface ClientDisplayProps {
  draftPlay: Partial<Play>;
}

export function ClientDisplay({ draftPlay }: ClientDisplayProps) {
  return <pre>{JSON.stringify(draftPlay, undefined, "\t")}</pre>;
}
