export default function DocContent({ doc }: any) {
  return <p dangerouslySetInnerHTML={{ __html: doc.content }} />;
}
