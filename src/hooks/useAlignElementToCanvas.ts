import { Ref, computed } from 'vue'
import { useStore } from 'vuex'
import { State, MutationTypes } from '@/store'
import { PPTElement, Slide } from '@/types/slides'
import { ElementAlignCommand, ElementAlignCommands } from '@/types/edit'
import { getElementListRange } from '@/utils/element'
import { VIEWPORT_SIZE, VIEWPORT_ASPECT_RATIO } from '@/configs/canvas'

export default () => {
  const store = useStore<State>()

  const activeElementIdList = computed(() => store.state.activeElementIdList)
  const activeElementList: Ref<PPTElement[]> = computed(() => store.getters.activeElementList)
  const currentSlide: Ref<Slide> = computed(() => store.getters.currentSlide)

  const alignElementToCanvas = (command: ElementAlignCommand) => {
    const viewportWidth = VIEWPORT_SIZE
    const viewportHeight = VIEWPORT_SIZE * VIEWPORT_ASPECT_RATIO
    const { minX, maxX, minY, maxY } = getElementListRange(activeElementList.value)
  
    const newElementList: PPTElement[] = JSON.parse(JSON.stringify(currentSlide.value.elements))
    for(const element of newElementList) {
      if(!activeElementIdList.value.includes(element.elId)) continue
      
      if(command === ElementAlignCommands.TOP) {
        const offsetY = minY - 0
        element.top = element.top - offsetY            
      }
      else if(command === ElementAlignCommands.VERTICAL) {
        const offsetY = minY + (maxY - minY) / 2 - viewportHeight / 2
        element.top = element.top - offsetY            
      }
      else if(command === ElementAlignCommands.BOTTOM) {
        const offsetY = maxY - viewportHeight
        element.top = element.top - offsetY       
      }
      
      else if(command === ElementAlignCommands.LEFT) {
        const offsetX = minX - 0
        element.left = element.left - offsetX            
      }
      else if(command === ElementAlignCommands.HORIZONTAL) {
        const offsetX = minX + (maxX - minX) / 2 - viewportWidth / 2
        element.left = element.left - offsetX            
      }
      else if(command === ElementAlignCommands.RIGHT) {
        const offsetX = maxX - viewportWidth
        element.left = element.left - offsetX            
      }
    }
    
    store.commit(MutationTypes.UPDATE_SLIDE, { elements: newElementList })
  }

  return {
    alignElementToCanvas,
  }
}