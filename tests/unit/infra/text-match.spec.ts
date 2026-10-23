import { containsIgnoringCase, matchesIgnoringCase } from '../../../src/infra/repositories/in-memory/text-match';

describe('text matching', () => {
  describe('matchesIgnoringCase', () => {
    it('matches when there is no expected value', () => {
      expect(matchesIgnoringCase('Preto')).toBe(true);
    });

    it('ignores case, accents and surrounding spaces', () => {
      expect(matchesIgnoringCase('Citroën', ' CITROEN ')).toBe(true);
    });

    it('does not match partial values', () => {
      expect(matchesIgnoringCase('Preto', 'Pre')).toBe(false);
    });
  });

  describe('containsIgnoringCase', () => {
    it('matches when there is no term', () => {
      expect(containsIgnoringCase('João')).toBe(true);
    });

    it('matches partial terms ignoring case and accents', () => {
      expect(containsIgnoringCase('João da Silva', 'joao')).toBe(true);
      expect(containsIgnoringCase('João da Silva', 'SILVA')).toBe(true);
    });

    it('does not match absent terms', () => {
      expect(containsIgnoringCase('João da Silva', 'Maria')).toBe(false);
    });
  });
});
