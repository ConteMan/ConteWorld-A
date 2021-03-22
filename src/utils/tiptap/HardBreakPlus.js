import { Node } from 'tiptap';
import { chainCommands, exitCode } from 'tiptap-commands';

export default class HardBreakPlus extends Node {
  get name() {
    return 'hard_break_plus';
  }

  get schema() {
    return {
      inline: true,
      group: 'inline',
      selectable: false,
      parseDOM: [
        { tag: 'br' },
      ],
      toDOM: () => ['br'],
    };
  }

  commands({ type }) {
    return () => chainCommands(exitCode, (state, dispatch) => {
      dispatch(state.tr.replaceSelectionWith(type.create()).scrollIntoView());
      return true;
    });
  }

  keys({ type }) {
    const command = chainCommands(exitCode, (state, dispatch) => {
      dispatch(state.tr.replaceSelectionWith(type.create()).scrollIntoView());
      return true;
    });
    return {
      'Shift-Enter': command,
    };
  }
}
