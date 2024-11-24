export default async function Page({
	params,
}: {
	params: Promise<{ courseId: string }>;
}) {
	const courseId = (await params).courseId;
	return <div>My Post: {courseId}</div>;
}
