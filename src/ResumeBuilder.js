import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';
import './ResumeBuilder.css';

const SectionList = [
  { id: 1, name: 'Profile Summary', description: 'Provide a brief summary of your professional profile.', content: '' },
  { id: 2, name: 'Academic & Curriculum Activities', description: 'List your educational background and academic achievements.', content: '' },
  { id: 3, name: 'Skills & Expertise', description: 'Highlight your skills and areas of expertise.', content: '' },
  { id: 4, name: 'Work Experience', description: 'Detail your work experience, including job responsibilities and achievements.', content: '' },
  { id: 5, name: 'Projects', description: 'Describe any significant projects you have worked on.', content: '' },
  { id: 6, name: 'Certificates', description: 'List any relevant certifications or qualifications you have obtained.', content: '' },
  { id: 7, name: 'Leadership & Volunteer Experience', description: 'Outline your leadership roles and involvement in volunteer activities.', content: '' },
  { id: 8, name: 'Extracurricular Activities', description: 'Mention your participation in extracurricular activities.', content: '' },
  { id: 9, name: 'Languages', description: 'Specify the languages you are proficient in.', content: '' },
];

const ResumeBuilder = () => {
  const [sections, setSections] = useState(SectionList);
  const [isModified, setIsModified] = useState(false);
  const [draggedSectionId, setDraggedSectionId] = useState(null);
  const [currentSection, setCurrentSection] = useState(null);

  const handleDragStart = (event, id) => {
    setDraggedSectionId(id);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', id);
  };

  const handleDragEnter = (event, targetId) => {
    event.preventDefault();
    if (draggedSectionId !== targetId) {
      const updatedSections = [...sections];
      const draggedSectionIndex = sections.findIndex((section) => section.id === draggedSectionId);
      const targetSectionIndex = sections.findIndex((section) => section.id === targetId);
      updatedSections.splice(targetSectionIndex, 0, updatedSections.splice(draggedSectionIndex, 1)[0]);
      setSections(updatedSections);
    }
  };

  const handleDragEnd = () => {
    setDraggedSectionId(null);
    setIsModified(true);
  };

  const handleEditName = (id, newName) => {
    const updatedSections = sections.map((section) => {
      if (section.id === id) {
        return { ...section, name: newName };
      }
      return section;
    });
    setSections(updatedSections);
    setIsModified(true);
  };

  const handleToggleSection = (id) => {
    const updatedSections = sections.map((section) => {
      if (section.id === id) {
        return { ...section, enabled: !section.enabled };
      }
      return section;
    });
    setSections(updatedSections);
    setIsModified(true);
  };

  const handleShowDescription = (section) => {
    setCurrentSection(section);
  };

  const handleCloseDescription = () => {
    setCurrentSection(null);
  };

  const handleContentChange = (id, content) => {
    const updatedSections = sections.map((section) => {
      if (section.id === id) {
        return { ...section, content };
      }
      return section;
    });
    setSections(updatedSections);
    setIsModified(true);
  };

  const handleSave = () => {
    // Perform save operation here
    setIsModified(false);
  };

  const handleDownload = () => {
    const content = document.getElementById('resume-content');
    html2pdf().from(content).save('resume.pdf');
  };

  return (
    <div className="resume-builder">
      <h1 className="resume-builder__title">Select Your Section</h1>
      <div className="resume-sections">
        {sections.map((section) => (
          <div
            key={section.id}
            className={`resume-section ${draggedSectionId === section.id ? 'dragged' : ''}`}
            draggable
            onDragStart={(e) => handleDragStart(e, section.id)}
            onDragEnter={(e) => handleDragEnter(e, section.id)}
            onDragEnd={handleDragEnd}
          >
            <div className="resume-section__menu" draggable onDragStart={(e) => handleDragStart(e, section.id)}>
              <div className="menu-button">&#x2630;</div>
            </div>
            <div className="resume-section__content">
              <div className="section-header">
                <h2 className="section-header__title">{section.name}</h2>
                <button
                  className="edit-button"
                  onClick={() => handleEditName(section.id, prompt('Enter new name'))}
                >
                  Edit
                </button>
              </div>
              <div className="section-info">
                <button
                  className="section-info-button"
                  onClick={() => handleShowDescription(section)}
                >
                  i
                </button>
                {currentSection === section && (
                  <div className="section-description">
                    <p>{section.description}</p>
                  </div>
                )}
              </div>
              <label className="section-toggle">
                <input
                  type="checkbox"
                  checked={section.enabled}
                  onChange={() => handleToggleSection(section.id)}
                />
                <span className="slider"></span>
              </label>
              {section.enabled && (
                <textarea
                  className="section-content"
                  value={section.content}
                  onChange={(e) => handleContentChange(section.id, e.target.value)}
                  placeholder="Enter content..."
                />
              )}
            </div>
          </div>
        ))}
      </div>
      {isModified && (
        <button className="save-button" onClick={handleSave}>
          Save
        </button>
      )}
      <button className="download-button" onClick={handleDownload}>
        Download PDF
      </button>
      {currentSection && (
        <div className="description-modal">
          <div className="description-content">
            <h3 className="description-content__title">{currentSection.name}</h3>
            <p className="description-content__text">{currentSection.description}</p>
            <button className="close-button" onClick={handleCloseDescription}>
              Close
            </button>
          </div>
        </div>
      )}
      <div id="resume-content" style={{ display: 'none' }}>
        {sections.map((section) => (
          section.enabled && <div key={section.id}>
            <h2>{section.name}</h2>
            <p>{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeBuilder;
