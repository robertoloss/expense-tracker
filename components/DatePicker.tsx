import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Dispatch, SetStateAction, use, useState } from "react"

type Props = {
	date: Date | undefined
	setDate: Dispatch<SetStateAction<Date | undefined>>
}
export function DatePicker({ date, setDate }: Props) {
	const [ open, setOpen ] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
				className="w-auto p-0" 
				align="start"
			>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d)=>{
						setDate(d)
						setOpen(false)
					}}
          initialFocus
					captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  )
}
