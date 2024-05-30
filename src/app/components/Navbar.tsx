'use client'
import React from 'react'
import { usePrivy } from '@privy-io/react-auth';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

const Navbar = () => {
  const { ready, authenticated, login, user, logout } = usePrivy();
  console.log(user)
  return (
    <header className="shrink-0 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <img className="h-12" src="/logo_transparent.png" />
        <h1 className="sr-only text-black font-extrabold font-sans text-2xl">FIP171</h1>
        <div className="flex items-center gap-x-8">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Your profile</span>
            {
              authenticated ?
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <MenuButton className="inline-flex w-full justify-center gap-x-1.5 px-3 py-2 text-sm font-semibold text-gray-900">
                      <img
                        className="h-8 w-8 rounded-full bg-gray-800"
                        src={user?.farcaster?.pfp || ""}
                        alt=""
                      />
                    </MenuButton>
                  </div>

                  <Transition
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">                                                
                          <MenuItem>
                            {({ focus }) => (
                              <button  
                                onClick={logout}                             
                                className={classNames(
                                  focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                  'block w-full px-4 py-2 text-left text-sm'
                                )}
                              >
                                Sign out
                              </button>
                            )}
                          </MenuItem>
                      </div>
                    </MenuItems>
                  </Transition>
                </Menu>
                :
                <button onClick={login}>Sign in</button>
            }
          </a>
        </div>
      </div>
    </header>
  )
}

export default Navbar