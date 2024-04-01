import React from 'react'
import { Button } from '../ui/button'
import { Bell, Cloud, Cloudy, Globe, Home, Settings, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'

const Sidebar = () => {
  return (
    <div className='hidden border-r bg-muted/40 md:block'>
    <div className='flex h-full max-h-screen flex-col gap-2'>
        <div className='flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6'>
            <Link to="/" className='flex items-center gap-2 font-semibold'>
            <img src="/images/real-time-collab-1.png" alt="rtc" width={40} height={40} />
            <span>SkribbleCode</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
        </div>
        <div className='flex-1'>
            <nav className='grid items-start px-2 text-sm font-medium lg:px-4'>
                <Link to='/' className='flex items-center gap-3 bg-muted rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'>
                <Home className="h-4 w-4" />
                Home
                </Link>
                <Link to='/' className='flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'>
                <Cloudy className="h-4 w-4" />
                Browse Rooms
                {/* <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  6
                </Badge> */}
                </Link>
                <Link to='/your-rooms' className='flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'>
                <Cloud className="h-4 w-4" />
                Your Rooms
                </Link>
                <Link to='/' className='flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'>
                <User className="h-4 w-4" />
                Profile
                </Link>
                <Link to='/' className='flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'>
                <Settings className="h-4 w-4" />
                Settings
                </Link>
            </nav>
            <Separator />
        </div>
        <div className='mt-auto p-4 flex flex-col gap-4'>
            <Button>Logout</Button>
            
            {/* <Card>
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card> */}

        </div>
    </div>
    </div>
  )
}

export default Sidebar