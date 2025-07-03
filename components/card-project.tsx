
export function ProjectCard() {
  return (
    <div className="w-[270px]">
      <div className="p-4">
        <img
          src="https://localhost/foto.jpg"
          alt="Image"
          className="relative w-full h-36 rounded-lg overflow-hidden mb-3"
        />
        <div className="text-sm font-medium">SparkPay</div>
        <div className="text-xs text-muted-foreground">Updated 6 days ago</div>
      </div>
    </div>
  )
}
