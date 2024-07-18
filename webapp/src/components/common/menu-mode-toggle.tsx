import { useTheme } from "next-themes"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"

type MenuModeToggleProps = {
  children: JSX.Element;
}

export function MenuModeToggle({ children }: MenuModeToggleProps) {
  const { setTheme, theme } = useTheme()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
      </DropdownMenuContent >
    </DropdownMenu >
  )
}
