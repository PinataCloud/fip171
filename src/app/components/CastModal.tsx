'use client'
import { useEffect, useState } from 'react'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { useExperimentalFarcasterSigner, usePrivy } from '@privy-io/react-auth'
import { useCurrentEditor } from '@tiptap/react'
import { ExternalEd25519Signer, HubRestAPIClient } from '@standard-crypto/farcaster-js';
import TipTapEditor from './TipTapEditor'


const client = new HubRestAPIClient({
  hubUrl: 'https://hub.pinata.cloud',
});

interface CastModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  fetchCasts: Function;
}

export default function CastModal({ open, setOpen, fetchCasts }: CastModalProps) {
  const [fcLinked, setLinked] = useState(false);
  const [content, setContent] = useState("<p></p>")
  const [needToSignIn, setNeedToSignIn] = useState(false);

  const { user, login, getAccessToken } = usePrivy()
  const { requestFarcasterSignerFromWarpcast, signFarcasterMessage, getFarcasterSignerPublicKey } = useExperimentalFarcasterSigner();
  const editor = useCurrentEditor()

  useEffect(() => {
    if (user && user.linkedAccounts) {
      setNeedToSignIn(false)
      const fcLinked: any = user.linkedAccounts.find((account: any) => account?.type === 'farcaster')
      if (fcLinked) {
        const linked = fcLinked.signerPublicKey
        if (linked) {
          setLinked(true)          
          //  check for previous cast text
          const text = localStorage.getItem("cast-text")
          if (text) {
            setContent(text)
          }
        }
      } else {
        setLinked(false)
      }
    } else {
      setNeedToSignIn(true)
    }
  }, [user])

  // useEffect(() => {
  //   localStorage.setItem("cast-text", content)
  // }, [content])

  const castMessage = async (text: string, markdown: string) => {
    try {
      const accessToken = await getAccessToken();
      const privySigner = new ExternalEd25519Signer(signFarcasterMessage, getFarcasterSignerPublicKey);
      const prunedText = text && text.length > 200 ? text.substring(0, 200) + "..." : text ? text : ""
      const fid = user?.farcaster?.fid || 0;

      const json = {
        "version": "1",
        "type": "text/plain",
        "content": {
          "body": markdown
        }
      }

      const res = await fetch(`http://localhost:3000/api/upload`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
      })

      const data: any = await res.json()
      const submitCastResponse = await client.submitCast(
        {
          text: prunedText,
          embeds: [
            {
              url: `fc+ipfs://${data.IpfsHash}`
            }
          ],
          parentUrl: 'https://warpcast.com/~/channel/fipworks'
        },
        fid,
        privySigner,
      );
      console.log(submitCastResponse)
      setContent("")
      setOpen(false);
      fetchCasts()
    } catch (error) {
      console.log(error)
      alert("Trouble sending cast")
    }
  }



  const CreateSignerPanel = () => {
    return (
      <>
        <div>
          <div className="mt-3 text-center sm:mt-5">
            <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
              Additional authorization needed
            </DialogTitle>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                In order to send casts to the Farcaster network, you'll need to approve write access. Click the button below to do so.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
            onClick={requestFarcasterSignerFromWarpcast}
          >
            Authorize
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
            onClick={() => setOpen(false)}
            data-autofocus
          >
            Cancel
          </button>
        </div>
      </>
    )
  }

  const CastPanel = () => {
    if (!editor) {
      return null
    }

    return (
      <>
        <div>
          <div className="mt-3 text-center sm:mt-5">
            <div className="mt-2 text-black text-left">
              <TipTapEditor setOpen={setOpen} castMessage={castMessage} />
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <Transition show={open}>
      <Dialog className="relative z-10" onClose={setOpen}>
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                {
                  fcLinked ?
                    <CastPanel /> :
                    needToSignIn ?
                      <div className="w-full m-auto text-center">
                        <button onClick={login} className="bg-primary text-white rounded-lg p-4 m-auto">
                          Sign in
                        </button>
                      </div> :
                      <CreateSignerPanel />
                }
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}