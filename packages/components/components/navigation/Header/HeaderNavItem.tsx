"use client";

import Link from "next/link";
import { Level1Item, Level2Item } from "@repo/types";

interface HeaderNavItemProps {
  item: Level1Item;
  openDropdown: string | null;
  openSubDropdown: string | null;
  onToggle: (text: string) => void;
  onSubToggle: (text: string) => void;
  onNavigate: () => void;
}

const HeaderNavItem = ({
  item,
  openDropdown,
  openSubDropdown,
  onToggle,
  onSubToggle,
  onNavigate,
}: HeaderNavItemProps) => {
  const hasDropdown = !!(item.level2 && item.level2.length > 0);
  const isOpen = openDropdown === item.text;

  return (
    <div className="relative">
      {hasDropdown ? (
        <button
          onClick={() => onToggle(item.text)}
          aria-expanded={isOpen}
          className="flex items-center font-bold text-[11px] tracking-[2.2px] uppercase transition-colors"
          style={{ color: "var(--theme-text)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--theme-link)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--theme-text)")}
        >
          {item.text}
          <svg
            className={`ml-1 w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      ) : (
        <Link
          href={item.href || "/"}
          className="font-bold text-[11px] tracking-[2.2px] uppercase transition-colors"
          style={{ color: "var(--theme-text)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--theme-link)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--theme-text)")}
        >
          {item.text}
        </Link>
      )}

      {hasDropdown && isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 shadow-lg rounded-md min-w-[280px] z-[9999]">
          {item.level2!.map((level2Item: Level2Item) => {
            const hasSubDropdown =
              level2Item.level3 && level2Item.level3.length > 0;
            const isSubOpen = openSubDropdown === level2Item.text;

            return (
              <div key={level2Item.text} className="relative">
                {hasSubDropdown ? (
                  <>
                    <button
                      onClick={() => onSubToggle(level2Item.text)}
                      aria-expanded={isSubOpen}
                      className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                      style={{ color: "var(--theme-text)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--theme-link)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--theme-text)")}
                    >
                      {level2Item.text}
                      <svg
                        className={`w-4 h-4 transition-transform ${isSubOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                    {isSubOpen && (
                      <div className="absolute top-0 right-full mr-2 bg-white border border-gray-200 shadow-lg rounded-md min-w-[280px] z-[9999]">
                        {level2Item.level3!.map((level3Item) => (
                          <Link
                            key={level3Item.text}
                            href={level3Item.href}
                            className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                            style={{ color: "var(--theme-text)" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--theme-link)")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--theme-text)")}
                            onClick={onNavigate}
                          >
                            {level3Item.text}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={level2Item.href}
                    className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                    style={{ color: "var(--theme-text)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--theme-link)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--theme-text)")}
                    onClick={onNavigate}
                  >
                    {level2Item.text}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export { HeaderNavItem };
export default HeaderNavItem;
