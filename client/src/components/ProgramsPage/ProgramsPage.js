import React, { useState, useEffect } from 'react';
import RenderEvent from './RenderEvent/RenderEvent';
import RenderCharacters from './RenderChracters/RenderCharacters';
import './ProgramsPage.css';

const ProgramsPage = () => {
    const [eventCount, setEventCount] = useState(0);
    const [programCount, setProgramCount] = useState(0);

    useEffect(() => {
        const updateCounts = () => {
            const listProgram = document.querySelector('.program ul');
            const lProgram = listProgram ? listProgram.querySelectorAll('li').length : 0;
            setProgramCount(lProgram);

            const listEvent = document.querySelector('.events ul');
            const lEvent = listEvent ? listEvent.querySelectorAll('li').length : 0;
            setEventCount(lEvent);
        };

        updateCounts();

        // Можно добавить слушателя изменений в списках, если используем библиотеку, которая поддерживает динамические списки
        const observer = new MutationObserver(updateCounts);
        const config = { childList: true, subtree: true };

        const programNode = document.querySelector('.program ul');
        const eventNode = document.querySelector('.events ul');

        if (programNode) observer.observe(programNode, config);
        if (eventNode) observer.observe(eventNode, config);

        return () => observer.disconnect();
    }, []);

    return (
        <div className='page programsPage'>
            <div className="type programsType">
                <div className='events pBlock'>
                    <h2>Мероприятия</h2>
                    <p>Мероприятий: {eventCount}</p>
                    <RenderEvent />
                </div>
                <div className='program pBlock'>
                    <h2>Персонажи</h2>
                    <p>Персонажи: {programCount}</p>
                    <RenderCharacters />
                </div>
            </div>
        </div>
    );
};

export default ProgramsPage;
