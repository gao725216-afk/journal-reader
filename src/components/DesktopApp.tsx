import { useLibraryStore } from '../store/libraryStore'
import Navbar from './Navbar'
import LibraryView from './LibraryView'
import MindMapView from './MindMapView'
import PaperViewer from './PaperViewer'
import MarkdownEditor from './MarkdownEditor'
import SummaryEditor from './SummaryEditor'
import './DesktopApp.css'

const DesktopApp = () => {
  const { currentView, selectedPaperId } = useLibraryStore()

  return (
    <div className="desktop-app">
      <Navbar />
      <main className="main-content">
        {currentView === 'library' && <LibraryView />}

        {currentView === 'mindmap' && <MindMapView />}

        {currentView === 'reading' && (
          <div className="reading-layout">
            {selectedPaperId ? (
              <>
                <div className="left-panel">
                  <PaperViewer />
                </div>
                <div className="right-panel">
                  <div className="panel-top">
                    <SummaryEditor />
                  </div>
                  <div className="panel-bottom">
                    <MarkdownEditor />
                  </div>
                </div>
              </>
            ) : (
              <div className="no-paper-selected">
                请先从论文库选择一篇论文
              </div>
            )}
          </div>
        )}

        {currentView === 'notes-only' && <MarkdownEditor />}
      </main>
    </div>
  )
}

export default DesktopApp
