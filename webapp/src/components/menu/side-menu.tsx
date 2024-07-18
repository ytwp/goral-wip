import '@/components/menu/side-menu.css'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { BarChartIcon, GearIcon, Half2Icon, KeyboardIcon, LaptopIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group'
import { MenuModeToggle } from '../common/menu-mode-toggle'
import { useTheme } from 'next-themes'
import { Theme } from '@/constant'

export function SideMenu() {
  const { setTheme, theme } = useTheme()

  return (<div className="h-screen">
    <div className="menu-body h-full w-16 border-l border-t border-b">
      <div className="flex flex-col justify-between">
        <div className="flex flex-col gap-2">
          <Avatar className="w-10 h-10 mb-2">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {/* <Button variant="outline" size="icon" className="w-10 h-10">
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="w-10 h-10">
            <ChevronRightIcon className="h-4 w-4" />
          </Button> */}
          <ToggleGroup type="single" className="flex-col gap-2">
            <ToggleGroupItem value="bold" aria-label="Toggle bold">
              <LaptopIcon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Toggle italic">
              <KeyboardIcon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">
              <BarChartIcon className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="flex flex-col gap-2">
          <MenuModeToggle>
            <Button variant="ghost" size="icon" className="w-10 h-10">
              {theme == Theme.Dark && <MoonIcon className="h-4 w-4" />}
              {theme == Theme.Light && <SunIcon className="h-4 w-4" />}
              {theme == Theme.System && <Half2Icon className="h-4 w-4" />}
            </Button>
          </MenuModeToggle>
          <Button variant="ghost" size="icon" className="w-10 h-10">
            <GearIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>)
}
