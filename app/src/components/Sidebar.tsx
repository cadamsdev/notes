
const tags = [
  'java',
  'python',
  'c++'
]

export default function Sidebar() {
  return (
    <div className="p-6 bg-slate-800">
      <button className=" bg-slate-200 hover:bg-slate-300 p-2 rounded mb-4">+ Create note</button>

      <div className="text-white">
        <div className="uppercase mb-4">Tags</div>
        {tags.map((tag) => {
          return (
            <div className="pl-4">
              {tag}<span className="text-gray-400">&nbsp;1</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
