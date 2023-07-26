import { ReadableAtom } from 'nanostores';
import { JSX, memo, useEffect } from 'preact/compat';
import { g_componentInfoList } from '../../../../store/Store';
import { CustomInput, InputInfo } from '../CustomInput/CustomInput';

const REGEXP_REPLACE = /(\/\*@.*@\*\/)/;
const REGEXP_NEW_LINE = /(\n)/;
const REGEXP_COMMENT = /((?:\/\/.*?\n)|(?:\/\*(?:.|\n)*?\*\/))/;
const REGEXP_REGEXP =
  // /(\/(?!\*).+\/)/;
  /(\/.+\/)/;
const REGEXP_STRING = /((?:".*")|(?:'.*')|(?:`(?:.|\n)*?`))/;
const REGEXP_KEYWORD =
  /\b(async|await|break|case|class|const|constructor|continue|else|false|for|function|if|in|let|new|null|of|return|super|switch|this|true|undefined|while)\b/;
const REGEXP_OPERATOR =
  // /((?:\+{1,2}|-{1,2}|\*{1,2}|\/|%|\!+|\?{1,2}|\<{1,3}|\>{1,3}|\^|~{1,2}|&{1,2}|\|{1,2})={0,2}|={1,3})/;
  /((?:\++|-+|\*+|\/|%|!+|\?+|<+|>+|\^|~+|&+|\|+)=*|=+)/;
const REGEXP_NUMBER = /\b([0-9]+)\b/;

const parseManager = (
  str: string | JSX.Element,
  regexp: RegExp,
  parser: (str: string) => JSX.Element
) => {
  // parse string only if it hasn't parsed yet
  // parsed strings will be return as JSX.Element
  return typeof str == 'string'
    ? str.split(regexp).map(s => (regexp.test(s) ? parser(s) : s))
    : str;
};

const newLineParser = (str: string | JSX.Element) =>
  parseManager(str, REGEXP_NEW_LINE, () => <br />);

const parsedComponent = (str: string, className: string) => {
  return <span className={className}>{newLineParser(str)}</span>;
};

const commentParser = (str: string) => parsedComponent(str, 'c');
const regexpParser = (str: string) => parsedComponent(str, 'r');
// FIXME: fail if strings include comment token (// ..., /* ... */).
const stringParser = (str: string) => parsedComponent(str, 's');
const keywordParser = (str: string) => parsedComponent(str, 'k');
const operatorParser = (str: string) => parsedComponent(str, 'o');
const numberParser = (str: string) => parsedComponent(str, 'n');

const parser = (
  codeString: string,
  isEnabled: ReadableAtom<boolean>
): [readonly (string | JSX.Element)[], readonly InputInfo[]] => {
  const componentInfoList: InputInfo[] = [];

  const infoSetter = (info: InputInfo) => {
    componentInfoList.push(info);
  };

  const replaceParser = (str: string) => {
    const token = str.slice(3, -3).split(/:/);

    if (import.meta.env.DEV) {
      if (token.length != 2)
        throw new Error(`invaild notation: "${token.join(':')}"`);
    }

    if (token[0] == 't') {
      return (
        <CustomInput
          infoSetter={infoSetter}
          isEnabled={isEnabled}
          initText={token[1]}
        />
      );
    }

    if (import.meta.env.DEV) {
      throw new Error(`invaild token: "${token.join(':')}"`);
    }

    return <></>;
  };

  return [
    [codeString]
      .flatMap(s => parseManager(s, REGEXP_REPLACE, replaceParser))
      .flatMap(s => parseManager(s, REGEXP_COMMENT, commentParser))
      .flatMap(s => parseManager(s, REGEXP_REGEXP, regexpParser))
      .flatMap(s => parseManager(s, REGEXP_STRING, stringParser))
      .flatMap(s => parseManager(s, REGEXP_KEYWORD, keywordParser))
      .flatMap(s => parseManager(s, REGEXP_OPERATOR, operatorParser))
      .flatMap(s => parseManager(s, REGEXP_NUMBER, numberParser))
      .flatMap(s => newLineParser(s)),
    componentInfoList,
  ];
};

// TODO: is it better to use memo?
export const CodeParser = memo(
  ({
    codeString,
    isEnabled,
  }: {
    codeString: string;
    isEnabled: ReadableAtom<boolean>;
  }) => {
    const [code, componentInfoList] = parser(codeString, isEnabled);

    useEffect(() => {
      g_componentInfoList.set(componentInfoList);
    }, [componentInfoList]);

    return (
      <pre>
        <code>{code}</code>
      </pre>
    );
  }
);
