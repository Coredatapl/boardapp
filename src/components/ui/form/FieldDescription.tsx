interface FieldDescriptionProps {
	content: string;
}

export default function FieldDescription({ content }: FieldDescriptionProps) {
	return <p className="text-xs text-gray-400 mt-1">{content}</p>;
}
