import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FiArrowLeft,
  FiCheckCircle,
  FiChevronRight,
  FiCreditCard,
  FiHome,
  FiLock,
  FiPlus,
  FiShield,
  FiSmartphone,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import {
  PaymentCard,
  BankDetailsCard,
  UpiDetailsCard,
  EmptyPayment,
} from "../../components/profile";

import profileService from "../../services/profileService";

const initialCardForm = {
  cardHolder: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
  type: "Visa",
};

const initialUpiForm = {
  upiId: "",
  provider: "",
};

const initialBankForm = {
  accountHolder: "",
  bankName: "",
  accountNumber: "",
  ifsc: "",
  branch: "",
};

function MyPayments() {
  const [cards, setCards] = useState([]);
  const [upiAccounts, setUpiAccounts] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modal, setModal] = useState(null);
  const [error, setError] = useState("");

  const [cardForm, setCardForm] = useState(initialCardForm);
  const [upiForm, setUpiForm] = useState(initialUpiForm);
  const [bankForm, setBankForm] = useState(initialBankForm);

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError("");

      const [upiResult, bankResult] =
        await Promise.allSettled([
          profileService.getUpiDetails(),
          profileService.getBankDetails(),
        ]);

      if (upiResult.status === "fulfilled") {
        const response = upiResult.value;

        const data =
          response?.upiDetails ??
          response?.upi ??
          response?.data ??
          response ??
          null;

        const list = Array.isArray(data)
          ? data
          : data?.upiId || data?.vpa
            ? [data]
            : [];

        setUpiAccounts(
          list.map((item, index) => ({
            id:
              item?._id ||
              item?.id ||
              `upi-${index}`,

            app:
              item?.provider ||
              item?.app ||
              "UPI",

            provider:
              item?.provider ||
              item?.app ||
              "UPI",

            upiId:
              item?.upiId ||
              item?.vpa ||
              "",

            default:
              Boolean(
                item?.isDefault ??
                item?.default ??
                index === 0
              ),

            verificationStatus:
              item?.verificationStatus ||
              item?.verification_status ||
              item?.status ||
              "not_verified",
          }))
        );
      } else {
        setUpiAccounts([]);
      }

      if (bankResult.status === "fulfilled") {
        const response = bankResult.value;

        const data =
          response?.bankDetails ??
          response?.bank ??
          response?.data ??
          response ??
          null;

        const list = Array.isArray(data)
          ? data
          : data?.accountNumber ||
              data?.accountNo ||
              data?.bankName
            ? [data]
            : [];

        setBankAccounts(
          list.map((item, index) => ({
            id:
              item?._id ||
              item?.id ||
              `bank-${index}`,

            bank:
              item?.bankName ||
              item?.bank ||
              "",

            accountNumber:
              item?.accountNumber ||
              item?.accountNo ||
              "",

            ifsc:
              item?.ifsc ||
              item?.ifscCode ||
              "",

            holder:
              item?.accountHolder ||
              item?.accountHolderName ||
              item?.holder ||
              item?.holderName ||
              "",

            branch:
              item?.branch ||
              item?.branchName ||
              "",

            default:
              Boolean(
                item?.isDefault ??
                item?.default ??
                index === 0
              ),
          }))
        );
      } else {
        setBankAccounts([]);
      }
    } catch (err) {
      console.error(
        "Payment Methods Error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load payment methods."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!mounted) return;
      await loadPayments();
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const openModal = (type) => {
    setError("");
    setModal(type);
  };

  const closeModal = () => {
    if (saving) return;

    setModal(null);
    setError("");
  };

  const handleCardChange = (event) => {
    const { name, value } = event.target;

    let nextValue = value;

    if (name === "cardNumber") {
      const digits = value
        .replace(/\D/g, "")
        .slice(0, 16);

      nextValue = digits
        .replace(/(.{4})/g, "$1 ")
        .trim();
    }

    if (name === "expiry") {
      const digits = value
        .replace(/\D/g, "")
        .slice(0, 4);

      nextValue =
        digits.length > 2
          ? `${digits.slice(0, 2)}/${digits.slice(2)}`
          : digits;
    }

    if (name === "cvv") {
      nextValue = value
        .replace(/\D/g, "")
        .slice(0, 4);
    }

    setCardForm((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  const addCard = (event) => {
    event.preventDefault();

    setError("");

    const cardNumber =
      cardForm.cardNumber.replace(
        /\s/g,
        ""
      );

    const expiry =
      cardForm.expiry.trim();

    const cvv =
      cardForm.cvv.trim();

    if (
      !cardForm.cardHolder.trim() ||
      !cardNumber ||
      !expiry ||
      !cvv
    ) {
      setError(
        "Please fill all card details."
      );
      return;
    }

    if (
      cardNumber.length < 13 ||
      cardNumber.length > 19
    ) {
      setError(
        "Please enter a valid card number."
      );
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      setError(
        "Expiry must be in MM/YY format."
      );
      return;
    }

    if (
      cvv.length < 3 ||
      cvv.length > 4
    ) {
      setError(
        "Please enter a valid CVV."
      );
      return;
    }

    const newCard = {
      id: `card-${Date.now()}`,
      bank: cardForm.type,
      cardHolder:
        cardForm.cardHolder.trim(),
      cardNumber:
        `**** **** **** ${cardNumber.slice(-4)}`,
      expiry,
      type: cardForm.type,
      default: cards.length === 0,
    };

    setCards((prev) => [
      ...prev,
      newCard,
    ]);

    setCardForm({
      ...initialCardForm,
    });

    setModal(null);
    setError("");
  };

  const handleUpiChange = (event) => {
    const { name, value } = event.target;

    setUpiForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addUpi = async (event) => {
    event.preventDefault();

    setError("");

    const upiId =
      upiForm.upiId
        .trim()
        .toLowerCase();

    const provider =
      upiForm.provider.trim();

    if (!upiId) {
      setError(
        "Please enter your UPI ID."
      );
      return;
    }

    if (
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+$/.test(
        upiId
      )
    ) {
      setError(
        "Please enter a valid UPI ID."
      );
      return;
    }

    try {
      setSaving(true);

      const response =
        await profileService.updateUpiDetails(
          {
            upiId,
            provider: provider || "UPI",
            isDefault:
              upiAccounts.length === 0,
            verificationStatus:
              "not_verified",
          }
        );

      const data =
        response?.upiDetails ??
        response?.upi ??
        response?.data ??
        response ??
        {};

      const newUpi = {
        id:
          data?._id ||
          data?.id ||
          `upi-${Date.now()}`,

        app:
          data?.provider ||
          provider ||
          "UPI",

        provider:
          data?.provider ||
          provider ||
          "UPI",

        upiId:
          data?.upiId ||
          data?.vpa ||
          upiId,

        default:
          Boolean(
            data?.isDefault ??
            data?.default ??
            upiAccounts.length === 0
          ),

        verificationStatus:
          data?.verificationStatus ||
          data?.status ||
          "not_verified",
      };

      setUpiAccounts((prev) => [
        ...prev,
        newUpi,
      ]);

      setUpiForm({
        ...initialUpiForm,
      });

      setModal(null);
      setError("");
    } catch (err) {
      console.error(
        "Add UPI Error:",
        err
      );

      setError(
        err?.message ||
          "Unable to save UPI details."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleBankChange = (event) => {
    const { name, value } = event.target;

    let nextValue = value;

    if (name === "ifsc") {
      nextValue =
        value
          .replace(/\s/g, "")
          .toUpperCase()
          .slice(0, 11);
    }

    if (name === "accountNumber") {
      nextValue = value
        .replace(/\D/g, "")
        .slice(0, 18);
    }

    setBankForm((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  const addBank = async (event) => {
    event.preventDefault();

    setError("");

    const accountHolder =
      bankForm.accountHolder.trim();

    const bankName =
      bankForm.bankName.trim();

    const accountNumber =
      bankForm.accountNumber.trim();

    const ifsc =
      bankForm.ifsc.trim().toUpperCase();

    const branch =
      bankForm.branch.trim();

    if (
      !accountHolder ||
      !bankName ||
      !accountNumber ||
      !ifsc ||
      !branch
    ) {
      setError(
        "Please fill all bank details."
      );
      return;
    }

    if (
      accountNumber.length < 8 ||
      accountNumber.length > 18
    ) {
      setError(
        "Please enter a valid account number."
      );
      return;
    }

    if (
      !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(
        ifsc
      )
    ) {
      setError(
        "Please enter a valid IFSC code."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        accountHolder,
        bankName,
        accountNumber,
        ifsc,
        branch,
        isDefault:
          bankAccounts.length === 0,
      };

      const response =
        await profileService.updateBankDetails(
          payload
        );

      const data =
        response?.bankDetails ??
        response?.bank ??
        response?.data ??
        response ??
        {};

      const newBank = {
        id:
          data?._id ||
          data?.id ||
          `bank-${Date.now()}`,

        bank:
          data?.bankName ||
          data?.bank ||
          bankName,

        accountNumber:
          data?.accountNumber ||
          data?.accountNo ||
          accountNumber,

        ifsc:
          data?.ifsc ||
          data?.ifscCode ||
          ifsc,

        holder:
          data?.accountHolder ||
          data?.accountHolderName ||
          accountHolder,

        branch:
          data?.branch ||
          data?.branchName ||
          branch,

        default:
          Boolean(
            data?.isDefault ??
            data?.default ??
            bankAccounts.length === 0
          ),
      };

      setBankAccounts((prev) => [
        ...prev,
        newBank,
      ]);

      setBankForm({
        ...initialBankForm,
      });

      setModal(null);
      setError("");
    } catch (err) {
      console.error(
        "Add Bank Error:",
        err
      );

      setError(
        err?.message ||
          "Unable to save bank details."
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteCard = (id) => {
    setCards((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );
  };

  const deleteUpi = (id) => {
    setUpiAccounts((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );
  };

  const deleteBank = (id) => {
    setBankAccounts((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );
  };

  const hasPayments =
    cards.length > 0 ||
    upiAccounts.length > 0 ||
    bankAccounts.length > 0;

  const inputClass =
    "w-full rounded-xl border border-border-subtle bg-brand-bg px-4 py-3 text-sm text-text-primary outline-none transition-all duration-300 placeholder:text-text-muted focus:border-accent focus:ring-2 focus:ring-accent/10";

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="animate-pulse rounded-3xl border border-border-subtle bg-surface-elevated p-8">
            <div className="h-8 w-64 rounded bg-surface" />

            <div className="mt-4 h-4 w-96 max-w-full rounded bg-surface" />

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map(
                (item) => (
                  <div
                    key={item}
                    className="h-48 rounded-2xl bg-surface"
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/profile"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition hover:text-accent"
        >
          <FiArrowLeft size={18} />
          Back to Profile
        </Link>

        <div className="overflow-hidden rounded-3xl border border-border-subtle bg-surface-elevated shadow-2xl">
          <div className="relative overflow-hidden p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                    <FiCreditCard size={25} />
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-400">
                    <FiShield size={13} />
                    Secure
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
                  My Payments
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
                  Manage your saved cards, UPI IDs and bank accounts securely.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  openModal("choose")
                }
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-brand-bg transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-lg"
              >
                <FiPlus size={18} />
                Add Payment Method
              </button>
            </div>
          </div>
        </div>

        {error && !modal && (
          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
            <p className="text-sm text-red-400">
              {error}
            </p>
          </div>
        )}

        {!hasPayments ? (
          <div className="mt-8">
            <EmptyPayment />

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() =>
                  openModal("card")
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-brand-bg transition hover:bg-accent-hover"
              >
                <FiCreditCard size={18} />
                Add Card
              </button>

              <button
                type="button"
                onClick={() =>
                  openModal("upi")
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-subtle bg-surface-elevated px-6 py-3 font-semibold text-text-primary transition hover:border-accent hover:text-accent"
              >
                <FiSmartphone size={18} />
                Add UPI
              </button>

              <button
                type="button"
                onClick={() =>
                  openModal("bank")
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-subtle bg-surface-elevated px-6 py-3 font-semibold text-text-primary transition hover:border-accent hover:text-accent"
              >
                <FiHome size={18} />
                Add Bank
              </button>
            </div>
          </div>
        ) : (
          <>
            {cards.length > 0 && (
              <section className="mt-10">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <FiCreditCard size={22} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary">
                      Saved Cards
                    </h2>

                    <p className="mt-1 text-sm text-text-secondary">
                      Your saved debit and credit cards.
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  {cards.map((card) => (
                    <div
                      key={card.id}
                      className="relative"
                    >
                      <PaymentCard
                        icon={FiCreditCard}
                        title={card.type}
                        subtitle={card.cardHolder}
                        value={card.cardNumber}
                        badge={`Expires ${card.expiry}`}
                        primary={card.default}
                      />

                      <div className="mt-3 flex justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            deleteCard(
                              card.id
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                        >
                          <FiTrash2 size={16} />
                          Remove Card
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {upiAccounts.length > 0 && (
              <section className="mt-10">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <FiSmartphone size={22} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary">
                      Saved UPI IDs
                    </h2>

                    <p className="mt-1 text-sm text-text-secondary">
                      Your saved UPI payment accounts.
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  {upiAccounts.map((upi) => (
                    <div
                      key={upi.id}
                      className="relative"
                    >
                      <UpiDetailsCard
                        app={upi.provider}
                        upiId={upi.upiId}
                        verificationStatus={
                          upi.verificationStatus
                        }
                        isDefault={
                          upi.default
                        }
                        onRemove={() =>
                          deleteUpi(
                            upi.id
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {bankAccounts.length > 0 && (
              <section className="mt-10">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <FiHome size={22} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-text-primary">
                      Saved Bank Accounts
                    </h2>

                    <p className="mt-1 text-sm text-text-secondary">
                      Your saved bank account details.
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  {bankAccounts.map(
                    (bank) => (
                      <div
                        key={bank.id}
                        className="relative"
                      >
                        <BankDetailsCard
                          bank={bank.bank}
                          accountNumber={
                            bank.accountNumber
                          }
                          ifsc={bank.ifsc}
                          holder={bank.holder}
                          branch={bank.branch}
                        />

                        <div className="mt-3 flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              deleteBank(
                                bank.id
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                          >
                            <FiTrash2
                              size={16}
                            />
                            Remove Bank
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </section>
            )}
          </>
        )}

        <section className="mt-10">
          <div className="rounded-3xl border border-dashed border-border-subtle bg-surface-elevated p-6 text-center sm:p-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft text-accent">
              <FiPlus size={30} />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-text-primary">
              Add a New Payment Method
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-text-secondary">
              Securely save your debit card, credit card, UPI ID, or bank account for faster checkout.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() =>
                  openModal("card")
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-brand-bg transition hover:bg-accent-hover"
              >
                <FiCreditCard size={18} />
                Add Card
              </button>

              <button
                type="button"
                onClick={() =>
                  openModal("upi")
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-subtle bg-surface px-6 py-3 font-semibold text-text-primary transition hover:border-accent hover:text-accent"
              >
                <FiSmartphone size={18} />
                Add UPI
              </button>

              <button
                type="button"
                onClick={() =>
                  openModal("bank")
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-subtle bg-surface px-6 py-3 font-semibold text-text-primary transition hover:border-accent hover:text-accent"
              >
                <FiHome size={18} />
                Add Bank Account
              </button>
            </div>
          </div>
        </section>
      </div>

      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-md">
          <button
            type="button"
            aria-label="Close modal"
            onClick={closeModal}
            className="absolute inset-0 h-full w-full cursor-default"
          />

          <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-border-subtle bg-surface-elevated p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  {modal === "card" && (
                    <FiCreditCard size={22} />
                  )}

                  {modal === "upi" && (
                    <FiSmartphone size={22} />
                  )}

                  {modal === "bank" && (
                    <FiHome size={22} />
                  )}

                  {modal === "choose" && (
                    <FiPlus size={22} />
                  )}
                </div>

                <h2 className="text-2xl font-bold text-text-primary">
                  {modal === "card" &&
                    "Add Card"}

                  {modal === "upi" &&
                    "Add UPI"}

                  {modal === "bank" &&
                    "Add Bank Account"}

                  {modal === "choose" &&
                    "Add Payment Method"}
                </h2>

                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  {modal === "card" &&
                    "Save your debit or credit card securely."}

                  {modal === "upi" &&
                    "Link your UPI ID for faster payments."}

                  {modal === "bank" &&
                    "Add your bank account details securely."}

                  {modal === "choose" &&
                    "Choose a payment method to continue."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-text-secondary transition hover:bg-surface hover:text-text-primary"
              >
                <FiX size={21} />
              </button>
            </div>

            {modal === "choose" && (
              <div className="mt-8 space-y-3">
                <button
                  type="button"
                  onClick={() =>
                    openModal("card")
                  }
                  className="group flex w-full items-center justify-between rounded-2xl border border-border-subtle bg-surface p-4 text-left transition hover:border-accent"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent">
                      <FiCreditCard size={21} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-text-primary">
                        Add Card
                      </h3>

                      <p className="text-sm text-text-secondary">
                        Debit or credit card
                      </p>
                    </div>
                  </div>

                  <FiChevronRight className="text-text-muted transition group-hover:translate-x-1 group-hover:text-accent" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    openModal("upi")
                  }
                  className="group flex w-full items-center justify-between rounded-2xl border border-border-subtle bg-surface p-4 text-left transition hover:border-accent"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent">
                      <FiSmartphone size={21} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-text-primary">
                        Add UPI
                      </h3>

                      <p className="text-sm text-text-secondary">
                        Google Pay, PhonePe, Paytm, etc.
                      </p>
                    </div>
                  </div>

                  <FiChevronRight className="text-text-muted transition group-hover:translate-x-1 group-hover:text-accent" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    openModal("bank")
                  }
                  className="group flex w-full items-center justify-between rounded-2xl border border-border-subtle bg-surface p-4 text-left transition hover:border-accent"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent">
                      <FiHome size={21} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-text-primary">
                        Add Bank Account
                      </h3>

                      <p className="text-sm text-text-secondary">
                        Save your bank account
                      </p>
                    </div>
                  </div>

                  <FiChevronRight className="text-text-muted transition group-hover:translate-x-1 group-hover:text-accent" />
                </button>
              </div>
            )}

            {error &&
              modal !== "choose" && (
                <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                  <p className="text-sm leading-5 text-red-400">
                    {error}
                  </p>
                </div>
              )}

            {modal === "card" && (
              <form
                onSubmit={addCard}
                className="mt-6 space-y-4"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-secondary">
                    Card Holder Name
                  </label>

                  <input
                    name="cardHolder"
                    value={
                      cardForm.cardHolder
                    }
                    onChange={
                      handleCardChange
                    }
                    placeholder="Name on card"
                    autoComplete="cc-name"
                    className={
                      inputClass
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-text-secondary">
                    Card Number
                  </label>

                  <input
                    name="cardNumber"
                    value={
                      cardForm.cardNumber
                    }
                    onChange={
                      handleCardChange
                    }
                    placeholder="1234 5678 9012 3456"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    className={
                      inputClass
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-text-secondary">
                      Expiry
                    </label>

                    <input
                      name="expiry"
                      value={
                        cardForm.expiry
                      }
                      onChange={
                        handleCardChange
                      }
                      placeholder="MM/YY"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      className={
                        inputClass
                      }
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-text-secondary">
                      CVV
                    </label>

                    <input
                      name="cvv"
                      type="password"
                      value={
                        cardForm.cvv
                      }
                      onChange={
                        handleCardChange
                      }
                      placeholder="•••"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      className={
                        inputClass
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-text-secondary">
                    Card Type
                  </label>

                  <select
                    name="type"
                    value={
                      cardForm.type
                    }
                    onChange={
                      handleCardChange
                    }
                    className={
                      inputClass
                    }
                  >
                    <option value="Visa">
                      Visa
                    </option>

                    <option value="MasterCard">
                      MasterCard
                    </option>

                    <option value="RuPay">
                      RuPay
                    </option>
                  </select>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-accent-soft p-3 text-xs leading-5 text-text-secondary">
                  <FiLock
                    className="mt-0.5 shrink-0 text-accent"
                    size={16}
                  />

                  <span>
                    For real production payments, never store raw card number or CVV in your database. Use Razorpay/another PCI-compliant payment provider.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-xl bg-accent px-5 py-3.5 font-semibold text-brand-bg transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : "Save Card"}
                </button>
              </form>
            )}

            {modal === "upi" && (
              <form
                onSubmit={addUpi}
                className="mt-6 space-y-4"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-secondary">
                    UPI ID
                  </label>

                  <input
                    name="upiId"
                    value={
                      upiForm.upiId
                    }
                    onChange={
                      handleUpiChange
                    }
                    placeholder="example@upi"
                    autoComplete="off"
                    className={
                      inputClass
                    }
                  />

                  <p className="mt-2 text-xs text-text-muted">
                    Example: prince@oksbi
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-text-secondary">
                    Provider
                  </label>

                  <select
                    name="provider"
                    value={
                      upiForm.provider
                    }
                    onChange={
                      handleUpiChange
                    }
                    className={
                      inputClass
                    }
                  >
                    <option value="">
                      Select Provider
                    </option>

                    <option value="Google Pay">
                      Google Pay
                    </option>

                    <option value="PhonePe">
                      PhonePe
                    </option>

                    <option value="Paytm">
                      Paytm
                    </option>

                    <option value="Amazon Pay">
                      Amazon Pay
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-accent-soft p-3 text-xs leading-5 text-text-secondary">
                  <FiShield
                    className="mt-0.5 shrink-0 text-accent"
                    size={16}
                  />

                  <span>
                    Your UPI ID will be stored securely. Verification status will come from the backend verification system.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-xl bg-accent px-5 py-3.5 font-semibold text-brand-bg transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : "Save UPI"}
                </button>
              </form>
            )}

            {modal === "bank" && (
              <form
                onSubmit={addBank}
                className="mt-6 space-y-4"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-secondary">
                    Account Holder Name
                  </label>

                  <input
                    name="accountHolder"
                    value={
                      bankForm.accountHolder
                    }
                    onChange={
                      handleBankChange
                    }
                    placeholder="Account holder name"
                    autoComplete="name"
                    className={
                      inputClass
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-text-secondary">
                    Bank Name
                  </label>

                  <input
                    name="bankName"
                    value={
                      bankForm.bankName
                    }
                    onChange={
                      handleBankChange
                    }
                    placeholder="e.g. HDFC Bank"
                    className={
                      inputClass
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-text-secondary">
                    Account Number
                  </label>

                  <input
                    name="accountNumber"
                    value={
                      bankForm.accountNumber
                    }
                    onChange={
                      handleBankChange
                    }
                    placeholder="Enter account number"
                    inputMode="numeric"
                    autoComplete="off"
                    className={
                      inputClass
                    }
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-text-secondary">
                      IFSC Code
                    </label>

                    <input
                      name="ifsc"
                      value={
                        bankForm.ifsc
                      }
                      onChange={
                        handleBankChange
                      }
                      placeholder="HDFC0001234"
                      maxLength={11}
                      autoComplete="off"
                      className={`${inputClass} uppercase`}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-text-secondary">
                      Branch
                    </label>

                    <input
                      name="branch"
                      value={
                        bankForm.branch
                      }
                      onChange={
                        handleBankChange
                      }
                      placeholder="Branch name"
                      className={
                        inputClass
                      }
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-accent-soft p-3 text-xs leading-5 text-text-secondary">
                  <FiLock
                    className="mt-0.5 shrink-0 text-accent"
                    size={16}
                  />

                  <span>
                    Your bank information is protected and account numbers should be masked when displayed.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-xl bg-accent px-5 py-3.5 font-semibold text-brand-bg transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : "Save Bank Account"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyPayments;