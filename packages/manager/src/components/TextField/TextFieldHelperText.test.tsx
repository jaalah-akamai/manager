import { fireEvent, screen } from '@testing-library/react';
import React from 'react';

import { renderWithTheme } from 'src/utilities/testHelpers';

import { TextFieldHelperText } from './TextFieldHelperText';

const LINK_TEXT = 'endpoint types';
const URL = '/path/to/endpoint-types';
const TEXT_BEFORE = 'Understand';
const TEXT_AFTER = 'for better performance.';

describe('TextFieldHelperText', () => {
  test('renders the component with textBefore, linkText, and textAfter', () => {
    const handleClick = vi.fn();

    renderWithTheme(
      <TextFieldHelperText
        linkText={LINK_TEXT}
        onClick={handleClick}
        textAfter={TEXT_AFTER}
        textBefore={TEXT_BEFORE}
        to={URL}
      />
    );

    expect(
      screen.getByText((content, element) => {
        return (
          element?.tagName.toLowerCase() === 'p' &&
          content.startsWith(TEXT_BEFORE)
        );
      })
    ).toBeInTheDocument();

    const linkElement = screen.getByText(LINK_TEXT);

    expect(linkElement).toBeInTheDocument();
    expect(linkElement.closest('a')).toHaveAttribute('href', URL);
    expect(
      screen.getByText((content, element) => {
        return (
          element?.tagName.toLowerCase() === 'p' && content.endsWith(TEXT_AFTER)
        );
      })
    ).toBeInTheDocument();

    fireEvent.click(linkElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('renders the component with linkText and textAfter', () => {
    const handleClick = vi.fn();

    renderWithTheme(
      <TextFieldHelperText
        linkText={LINK_TEXT}
        onClick={handleClick}
        textAfter={TEXT_AFTER}
        to={URL}
      />
    );

    const linkElement = screen.getByText(LINK_TEXT);

    expect(linkElement).toBeInTheDocument();
    expect(linkElement.closest('a')).toHaveAttribute('href', URL);
    expect(
      screen.getByText((content, element) => {
        return (
          element?.tagName.toLowerCase() === 'p' && content.includes(TEXT_AFTER)
        );
      })
    ).toBeInTheDocument();

    fireEvent.click(linkElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('renders the component with only linkText', () => {
    const handleClick = vi.fn();

    renderWithTheme(
      <TextFieldHelperText
        linkText={LINK_TEXT}
        onClick={handleClick}
        to={URL}
      />
    );

    const linkElement = screen.getByText(LINK_TEXT);

    expect(linkElement).toBeInTheDocument();
    expect(linkElement.closest('a')).toHaveAttribute('href', URL);

    fireEvent.click(linkElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
