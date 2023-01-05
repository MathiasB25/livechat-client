import { useEffect, useState } from "react";

export default function ContextMenu({ children, top, left }) {

    return <div className="absolute z-10" style={{ top, left }}>{children}</div>
}