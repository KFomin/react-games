export const linkStyle = "border border-stone-200 px-4 py-2 transition-all " +
    "hover:bg-stone-800 shadow-customBoxShadow hover:shadow-customBoxShadowActive"

export default function Navigation() {
    return (
        <nav>
            <ul>
                <li>
                    <a className={linkStyle} href={'/puzzle'}>
                        puzzle
                    </a>
                </li>
            </ul>
        </nav>
    );
}
