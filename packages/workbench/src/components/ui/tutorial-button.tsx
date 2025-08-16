import { MotiaTutorial, TutorialConfig } from '@motiadev/tutorial'
import { Button } from '@motiadev/ui'
import { Book } from 'lucide-react'
import { useStreamItem } from '@motiadev/stream-client-react'
import { FlowConfigResponse } from '@/types/flow'
import { FC, useCallback, useEffect, useState } from 'react'
import { useFlowStore } from '@/stores/use-flow-store'
import { Tooltip } from './tooltip'

export const TutorialButton: FC = () => {
  const [isTutorialFlowMissing, setIsTutorialFlowMissing] = useState(true)
  const selectFlowId = useFlowStore((state) => state.selectFlowId)
  const { data: flowConfig } = useStreamItem<FlowConfigResponse>({
    streamName: '__motia.flowsConfig',
    groupId: 'default',
    id: 'basic-tutorial',
  })

  const startTutorial = useCallback(
    (resetState = false) => {
      const tutorialStepIndex = new URLSearchParams(window.location.search).get('tutorialStepIndex')
      const config: TutorialConfig = {
        resetSkipState: resetState,
      }
      if (tutorialStepIndex && !resetState) {
        config.initialStepIndex = Number(tutorialStepIndex)
      }

      selectFlowId('basic-tutorial')
      MotiaTutorial.start(config)

      if (resetState) {
        const url = new URL(window.location.href)
        url.searchParams.delete('tutorialStepIndex')
        window.history.replaceState(null, '', url)
      }
    },
    [selectFlowId],
  )

  useEffect(() => {
    if (import.meta.env.VITE_MOTIA_TUTORIAL_DISABLED || !flowConfig) {
      console.log('Tutorial disabled or flow not found')
      return
    }

    setIsTutorialFlowMissing(false)
    startTutorial()

    return () => MotiaTutorial.close()
  }, [flowConfig, startTutorial])

  if (import.meta.env.VITE_MOTIA_TUTORIAL_DISABLED) {
    return null
  }

  const trigger = (
    <Button
      data-testid="tutorial-trigger"
      variant={isTutorialFlowMissing ? 'default' : 'accent'}
      size="sm"
      onClick={() => (!isTutorialFlowMissing ? startTutorial(true) : void 0)}
    >
      <Book className="h-4 w-4" />
      <span>Tutorial</span>
    </Button>
  )

  if (isTutorialFlowMissing) {
    return (
      <Tooltip
        content={
          <div className="flex flex-col gap-4 p-4 max-w-[320px]">
            <p className="text-sm wrap-break-word p-0 m-0">
              In order to start the tutorial, you need to download the tutorial steps using the Motia CLI. In your
              terminal execute:
            </p>
            <pre className="text-sm font-bold">motia generate tutorial-flow</pre>
          </div>
        }
      >
        {trigger}
      </Tooltip>
    )
  }

  return trigger
}
