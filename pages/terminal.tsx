export default function Terminal() {
  return (
    <div className="w-2/3 min-w-[400px]">
      <div className="relative h-10 rounded-t-md bg-[rgba(45,45,45,1)] before:absolute before:left-1 before:m-3 before:h-4 before:w-4 before:rounded-full before:bg-[rgba(100,100,100,1)] before:shadow-[1.4em_0em_rgba(100,100,100,1),2.8em_0em_rgba(100,100,100,1)] before:content-['']"></div>
      <div className="relative h-96 rounded-b-md bg-[rgba(20,20,20,1)]"></div>
    </div>
  );
}
