import EditBookClient from "./EditBookClient";

export default async function EditBookPage({ params }: { params: Promise<{ bookId: string }> }) {
  const { bookId } = await params;
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-2xl font-bold">Editar livro</h1>
  {/* Client component will load from localStorage */}
  <EditBookClient bookId={bookId} />
    </main>
  );
}
