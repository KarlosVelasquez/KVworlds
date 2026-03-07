import { useEffect, useRef, useState } from 'react';

export default function DecryptedText({
  text,
  speed = 50,
  startDelay = 0,
  maxIterations = 10,
  sequential = false,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'hover',
  shouldStart = false,
  onComplete,
  ...props
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState(new Set());
  const [hasAnimated, setHasAnimated] = useState(false);
  const hasCompletedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const containerRef = useRef(null);

  const resetScrambleState = () => {
    setDisplayText(text);
    setRevealedIndices(new Set());
    setIsScrambling(false);
    hasCompletedRef.current = false;
  };

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    let interval;
    let startTimer;
    let currentIteration = 0;

    const getNextIndex = (revealedSet) => {
      const textLength = text.length;

      switch (revealDirection) {
        case 'start':
          return revealedSet.size;
        case 'end':
          return textLength - 1 - revealedSet.size;
        case 'center': {
          const middle = Math.floor(textLength / 2);
          const offset = Math.floor(revealedSet.size / 2);
          const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;

          if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
            return nextIndex;
          }

          for (let i = 0; i < textLength; i += 1) {
            if (!revealedSet.has(i)) {
              return i;
            }
          }

          return 0;
        }
        default:
          return revealedSet.size;
      }
    };

    const availableChars = useOriginalCharsOnly
      ? Array.from(new Set(text.split(''))).filter((char) => char !== ' ')
      : characters.split('');

    const shuffleText = (originalText, currentRevealed) => {
      if (useOriginalCharsOnly) {
        const positions = originalText.split('').map((char, i) => ({
          char,
          isSpace: char === ' ',
          index: i,
          isRevealed: currentRevealed.has(i),
        }));

        const nonSpaceChars = positions
          .filter((position) => !position.isSpace && !position.isRevealed)
          .map((position) => position.char);

        for (let i = nonSpaceChars.length - 1; i > 0; i -= 1) {
          const j = Math.floor(Math.random() * (i + 1));
          [nonSpaceChars[i], nonSpaceChars[j]] = [nonSpaceChars[j], nonSpaceChars[i]];
        }

        let charIndex = 0;
        return positions
          .map((position) => {
            if (position.isSpace) {
              return ' ';
            }

            if (position.isRevealed) {
              return originalText[position.index];
            }

            const nextChar = nonSpaceChars[charIndex];
            charIndex += 1;
            return nextChar;
          })
          .join('');
      }

      return originalText
        .split('')
        .map((char, i) => {
          if (char === ' ') {
            return ' ';
          }

          if (currentRevealed.has(i)) {
            return originalText[i];
          }

          return availableChars[Math.floor(Math.random() * availableChars.length)];
        })
        .join('');
    };

    const beginScramble = () => {
      setRevealedIndices(new Set());
      setDisplayText(shuffleText(text, new Set()));
      setIsScrambling(true);
      interval = setInterval(() => {
        setRevealedIndices((prevRevealed) => {
          if (sequential) {
            if (prevRevealed.size < text.length) {
              const nextIndex = getNextIndex(prevRevealed);
              const newRevealed = new Set(prevRevealed);
              newRevealed.add(nextIndex);
              setDisplayText(shuffleText(text, newRevealed));
              return newRevealed;
            }

            clearInterval(interval);
            setIsScrambling(false);

            if (!hasCompletedRef.current) {
              hasCompletedRef.current = true;
              onCompleteRef.current?.();
            }

            return prevRevealed;
          }

          setDisplayText(shuffleText(text, prevRevealed));
          currentIteration += 1;

          if (currentIteration >= maxIterations) {
            clearInterval(interval);
            setIsScrambling(false);
            setDisplayText(text);

            if (!hasCompletedRef.current) {
              hasCompletedRef.current = true;
              onCompleteRef.current?.();
            }
          }

          return prevRevealed;
        });
      }, speed);
    };

    if (isHovering) {
      if (startDelay > 0) {
        startTimer = setTimeout(beginScramble, startDelay);
      } else {
        beginScramble();
      }
    }

    return () => {
      if (startTimer) {
        clearTimeout(startTimer);
      }

      if (interval) {
        clearInterval(interval);
      }
    };
  }, [
    isHovering,
    text,
    speed,
    startDelay,
    maxIterations,
    sequential,
    revealDirection,
    characters,
    useOriginalCharsOnly,
  ]);

  useEffect(() => {
    if (animateOn !== 'view' && animateOn !== 'both') {
      return undefined;
    }

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsHovering(true);
          setHasAnimated(true);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    });

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [animateOn, hasAnimated]);

  useEffect(() => {
    if (!shouldStart || hasAnimated) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setIsHovering(true);
      setHasAnimated(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [shouldStart, hasAnimated]);

  const hoverProps =
    animateOn === 'hover' || animateOn === 'both'
      ? {
          onMouseEnter: () => {
            resetScrambleState();
            setIsHovering(true);
          },
          onMouseLeave: () => {
            setIsHovering(false);
            resetScrambleState();
          },
        }
      : {};

  return (
    <span
      ref={containerRef}
      className={`inline-block whitespace-pre-wrap ${parentClassName}`}
      {...hoverProps}
      {...props}
    >
      <span className="sr-only">{displayText}</span>

      <span aria-hidden="true">
        {displayText.split('').map((char, index) => {
          const isRevealedOrDone = revealedIndices.has(index) || !isScrambling || !isHovering;

          return (
            <span key={`${char}-${index}`} className={isRevealedOrDone ? className : encryptedClassName}>
              {char}
            </span>
          );
        })}
      </span>
    </span>
  );
}
