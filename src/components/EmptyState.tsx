type EmptyStateProps = {
  text: string;
};

export default function EmptyState({ text }: EmptyStateProps) {
  return <p className="empty">{text}</p>;
}
