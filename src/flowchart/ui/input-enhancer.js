export function enhanceTextInput(textInput) {
    const wrapper = document.createElement('div');
    wrapper.className = 'enhanced-textarea-wrapper';
    textInput.parentNode.insertBefore(wrapper, textInput);
    wrapper.appendChild(textInput);

    function updateStyles() {
        const lines = textInput.value.split('\n');
        const lineHeight = parseInt(getComputedStyle(textInput).lineHeight);
        const padding = parseInt(getComputedStyle(textInput).paddingTop);
        
        const markers = document.createElement('div');
        markers.className = 'line-markers';
        
        // Track previous level for comparison
        let prevLevel = 0;
        let levelStack = [];
        
        lines.forEach((line, index) => {
            const marker = document.createElement('div');
            marker.className = 'line-marker';
            
            // Get indent level from '>' characters
            const indentMatch = line.match(/^>*/);
            const currentIndent = indentMatch ? indentMatch[0].length : 0;
            const cleanLine = line.replace(/^>+/, '').trim();
            
            // Calculate true level based on hierarchy
            if (currentIndent > prevLevel) {
                // Going deeper
                levelStack.push(currentIndent);
            } else if (currentIndent < prevLevel) {
                // Going back up - pop until we find the right level
                while (levelStack.length > 0 && levelStack[levelStack.length - 1] > currentIndent) {
                    levelStack.pop();
                }
            } else if (currentIndent === 0) {
                // Reset at root level
                levelStack = [];
            }
            
            // Current true level is the stack position
            const trueLevel = currentIndent === 0 ? 0 : levelStack.length;
            prevLevel = currentIndent;
            
            let type = 'default';
            if (cleanLine.startsWith('Start:')) type = 'start';
            else if (cleanLine.startsWith('Block:')) type = 'block';
            else if (cleanLine.startsWith('Tree:')) type = 'tree';
            else if (cleanLine.startsWith('Note:')) type = 'note';
            else if (cleanLine.startsWith('Label:')) type = 'label';
            else if (cleanLine.match(/^\d+:/)) type = 'branch';
            
            marker.classList.add(`marker-${type}`);
            
            const levelIndicator = document.createElement('div');
            levelIndicator.className = `level-indicator level-${type}`;
            levelIndicator.textContent = trueLevel;
            marker.appendChild(levelIndicator);
            
            marker.style.top = `${padding + (index * lineHeight)}px`;
            markers.appendChild(marker);
        });

        const existing = wrapper.querySelector('.line-markers');
        if (existing) wrapper.removeChild(existing);
        wrapper.appendChild(markers);
    }

    // Update markers on input
    textInput.addEventListener('input', updateStyles);

    // Update markers on scroll
    textInput.addEventListener('scroll', () => {
        const markers = wrapper.querySelector('.line-markers');
        if (markers) {
            markers.style.transform = `translateY(-${textInput.scrollTop}px)`;
        }
    });

    // Initial setup
    updateStyles();
    return { wrapper, updateStyles };
} 