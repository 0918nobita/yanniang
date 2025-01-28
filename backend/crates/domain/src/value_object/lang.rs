use std::fmt::Display;

use thiserror::Error;

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub enum Lang {
    Macro(MacroLang),
    Individual(IndividualLang),
}

impl Display for Lang {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let str = match self {
            Lang::Macro(m) => m.to_string(),
            Lang::Individual(i) => i.to_string(),
        };

        write!(f, "{}", str)?;
        Ok(())
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub enum MacroLang {
    /// 闽语
    Min,
    /// 中文
    Zho,
}

impl MacroLang {
    pub fn children(&self) -> Vec<Lang> {
        match self {
            MacroLang::Min => vec![Lang::Individual(IndividualLang::SouthernMin)],
            MacroLang::Zho => vec![Lang::Individual(IndividualLang::Wuu)],
        }
    }
}

impl Display for MacroLang {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let str = match self {
            MacroLang::Min => "min",
            MacroLang::Zho => "zho",
        };

        write!(f, "{}", str)?;
        Ok(())
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub enum IndividualLang {
    /// 官话
    Cmn,
    /// 德语
    Deu,
    /// 芬兰语
    Fin,
    /// 意大利语
    Ita,
    /// 日语
    Jpn,
    /// 闽南语
    SouthernMin,
    /// 吴语
    Wuu,
    /// 粤语
    Yue,
}

impl IndividualLang {
    pub fn parent(&self) -> Option<MacroLang> {
        match self {
            IndividualLang::Cmn => Some(MacroLang::Zho),
            IndividualLang::Deu => None,
            IndividualLang::Fin => None,
            IndividualLang::Ita => None,
            IndividualLang::Jpn => None,
            IndividualLang::SouthernMin => Some(MacroLang::Min),
            IndividualLang::Wuu => Some(MacroLang::Zho),
            IndividualLang::Yue => Some(MacroLang::Zho),
        }
    }
}

impl Display for IndividualLang {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let str = match self {
            IndividualLang::Cmn => "cmn",
            IndividualLang::Deu => "deu",
            IndividualLang::Fin => "fin",
            IndividualLang::Ita => "ita",
            IndividualLang::Jpn => "jpn",
            IndividualLang::SouthernMin => "southern_min",
            IndividualLang::Wuu => "wuu",
            IndividualLang::Yue => "yue",
        };
        write!(f, "{}", str)?;
        Ok(())
    }
}

#[derive(Debug, Error)]
#[error("Invalid lang")]
pub struct LangError;

impl<'a> TryFrom<&'a str> for Lang {
    type Error = LangError;

    #[tracing::instrument]
    fn try_from(value: &'a str) -> Result<Self, Self::Error> {
        match value {
            "min" => Ok(Lang::Macro(MacroLang::Min)),
            "zho" => Ok(Lang::Macro(MacroLang::Zho)),
            "cmn" => Ok(Lang::Individual(IndividualLang::Cmn)),
            "deu" => Ok(Lang::Individual(IndividualLang::Deu)),
            "fin" => Ok(Lang::Individual(IndividualLang::Fin)),
            "ita" => Ok(Lang::Individual(IndividualLang::Ita)),
            "jpn" => Ok(Lang::Individual(IndividualLang::Jpn)),
            "southern_min" => Ok(Lang::Individual(IndividualLang::SouthernMin)),
            "wuu" => Ok(Lang::Individual(IndividualLang::Wuu)),
            "yue" => Ok(Lang::Individual(IndividualLang::Yue)),
            _ => Err(LangError),
        }
    }
}
