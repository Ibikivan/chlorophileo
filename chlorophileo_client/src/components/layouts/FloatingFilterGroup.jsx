

export default function FloatingFilterGroup() {

    return <div className="fixed h-screen w-full z-4 flex">
        <div className="absolute join left-[25%]">
            <div className="shrink-0">
                <div>
                    <input className="input join-item" placeholder="Search" />
                </div>
            </div>
            <select className="select join-item">
                <option disabled selected>Filter</option>
                <option>Sci-fi</option>
                <option>Drama</option>
                <option>Action</option>
            </select>
            <div className="indicator">
                <button className="btn join-item">Search</button>
            </div>
        </div>
    </div>
}