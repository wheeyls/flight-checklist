import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

function ChecklistItemComponent({ item }) {
  function toggleCheck() {
    item.toggle();
  }

  return (
    <>
      <div
        className={classNames({
          item: true,
          'item--completed': item.completed
        })}
        onClick={toggleCheck}
      >
        <div className={classNames({ item__challenge: 'true' })}>
          <input
            type="checkbox"
            readOnly={true}
            checked={item.completed}
            className={classNames({ item__check: 'true' })}
          />
          {item.challenge}
        </div>
        <div className={classNames({ item__response: 'true' })}>
          {item.response}
        </div>
      </div>
    </>
  );
}

function ChecklistSectionComponent({ section, onChoose, nextSection, prevSection, chosen }) {
  return (
    <div className={classNames({ section: true, 'section--selected': chosen })}>
      <div className="section__header">
        <h2 onClick={() => onChoose(section)}>{section.title}</h2>
        <div>
          <button className="btn" onClick={() => section.reset()}>
            Reset
          </button>
          <button className="btn" onClick={() => prevSection()}>
            Back
          </button>
          <button className="btn" onClick={() => nextSection()}>
            Next
          </button>
        </div>
      </div>

      <div className="section__body">
        {section.items.map((i) => (
          <ChecklistItemComponent
            item={i}
            key={`${section.title}-${i.challenge}-${i.response}`}
          />
        ))}
      </div>
    </div>
  );
}

function ChecklistMenuComponent({ chosenSection, sections, onChoose }) {
  const [expanded, setExpanded] = useState(true);

  function toggleExpand() {
    setExpanded(!expanded);
  }

  function handleChoose(section) {
    onChoose(section);
    setExpanded(false);
  }

  return (
    <nav className={classNames({ menu: true, 'menu--expanded': expanded })}>
      <button
        className={classNames({
          btn: true,
          menu__toggle: true,
          'menu__toggle--expanded': expanded
        })}
        onClick={toggleExpand}
      ></button>
      <ul>
        {sections.map((section) => (
          <li
            className={classNames({
              menu__item: true,
              'menu__item--selected': section === chosenSection
            })}
          >
            <a href="#" onClick={() => handleChoose(section)}>
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function ChecklistComponent({ checklist, voice }) {
  const [sections, setSections] = useState(checklist.sections);
  const [chosenSection, setChosenSection] = useState(checklist.sections[0]);

  voice.set(chosenSection);

  function handleChosenSection(section) {
    setChosenSection(section || checklist.sections[0]);
  }

  useEffect(() => {
    const update = () => {
      setSections(checklist.sections.slice());
    };

    checklist.on('changed', update);
    return () => checklist.off('changed', update);
  });

  return (
    <div className="checklist">
      <h1>{checklist.title}</h1>

      <ChecklistMenuComponent
        chosenSection={chosenSection}
        sections={checklist.sections}
        onChoose={handleChosenSection}
      />
      {checklist.sections.map((i, idx) => (
        <ChecklistSectionComponent
          voice={voice}
          section={i}
          key={i.title}
          prevSection={() => handleChosenSection(checklist.sections[idx - 1])}
          nextSection={() => handleChosenSection(checklist.sections[idx + 1])}
          onChoose={handleChosenSection}
          chosen={chosenSection === i}
        />
      ))}
    </div>
  );
}