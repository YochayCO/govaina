import remarkGfm from "remark-gfm"
import Markdown from 'react-markdown'
import './EvaluationSection.css'

function EvaluationSection({ text }: { text: string }) {

  return (
    <div className='eval-section'>
			<div className='eval-result'>
				<h2>תוצאה</h2>
        <Markdown remarkPlugins={[remarkGfm]}>{text}</Markdown>
			</div>
    </div>
  )
}

export default EvaluationSection
